import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../Types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "pendohub-cart";

// Check whether a value is a valid object.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Validate cart items restored from localStorage.
function isValidCartItem(item: unknown): item is CartItem {
  if (!isRecord(item) || !isRecord(item.product)) {
    return false;
  }

  const product = item.product;
  const quantity = item.quantity;

  return (
    typeof product._id === "string" &&
    product._id.trim().length > 0 &&
    typeof product.name === "string" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    product.price >= 0 &&
    typeof product.quantity === "number" &&
    Number.isInteger(product.quantity) &&
    product.quantity >= 1 &&
    typeof quantity === "number" &&
    Number.isInteger(quantity) &&
    quantity >= 1 &&
    quantity <= product.quantity
  );
}

// Restore the cart from browser storage.
function loadCart(): CartItem[] {
  try {
    if (typeof window === "undefined") {
      return [];
    }

    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
      return [];
    }

    const parsed: unknown = JSON.parse(savedCart);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const validItems = parsed.filter(isValidCartItem);

    // Avoid duplicate products in the cart.
    const uniqueItems = new Map<string, CartItem>();

    for (const item of validItems) {
      if (!uniqueItems.has(item.product._id)) {
        uniqueItems.set(item.product._id, item);
      }
    }

    return Array.from(uniqueItems.values());
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart);

  // Save cart changes automatically.
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify(cartItems)
        );
      }
    } catch {
      // The cart remains usable in React state if storage fails.
    }
  }, [cartItems]);

  // Add a product or increase its quantity.
  const addToCart = (product: Product) => {
    if (
      !product._id ||
      !product.name?.trim() ||
      !Number.isFinite(product.price) ||
      product.price < 0 ||
      !Number.isInteger(product.quantity) ||
      product.quantity < 1
    ) {
      return;
    }

    setCartItems((items) => {
      const existingItem = items.find(
        (item) => item.product._id === product._id
      );

      if (existingItem) {
        // Do not exceed the available stock.
        if (existingItem.quantity >= product.quantity) {
          return items;
        }

        return items.map((item) =>
          item.product._id === product._id
            ? {
                ...item,
                product,
                quantity: Math.min(
                  item.quantity + 1,
                  product.quantity
                ),
              }
            : item
        );
      }

      return [...items, { product, quantity: 1 }];
    });
  };

  // Remove a product from the cart.
  const removeFromCart = (productId: string) => {
    setCartItems((items) =>
      items.filter((item) => item.product._id !== productId)
    );
  };

  // Update a product's quantity without exceeding stock.
  const updateQuantity = (productId: string, quantity: number) => {
    if (!Number.isInteger(quantity)) {
      return;
    }

    setCartItems((items) =>
      items.flatMap((item) => {
        if (item.product._id !== productId) {
          return [item];
        }

        const stock = item.product.quantity;

        if (!Number.isInteger(stock) || stock < 1) {
          return [];
        }

        return [
          {
            ...item,
            quantity: Math.max(1, Math.min(quantity, stock)),
          },
        ];
      })
    );
  };

  // Empty the entire cart.
  const clearCart = () => {
    setCartItems([]);
  };

  // Total number of individual items.
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total price before shipping or other charges.
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Access the cart from any component inside CartProvider.
export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
