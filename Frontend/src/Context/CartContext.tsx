
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../Services/productService";

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

function loadCart(): CartItem[] {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) return [];

    const parsed: unknown = JSON.parse(savedCart);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is CartItem => {
      return (
        item !== null &&
        typeof item === "object" &&
        "product" in item &&
        "quantity" in item &&
        item.product !== null &&
        typeof item.product === "object" &&
        typeof item.product._id === "string" &&
        typeof item.product.name === "string" &&
        typeof item.product.price === "number" &&
        Number.isFinite(item.product.price) &&
        item.product.price >= 0 &&
        typeof item.product.quantity === "number" &&
        Number.isFinite(item.product.quantity) &&
        item.product.quantity >= 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= item.product.quantity
      );
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch {
      // The cart remains usable in memory if storage is unavailable.
    }
  }, [cartItems]);

  const addToCart = (product: Product) => {
    if (product.quantity < 1) return;

    setCartItems((items) => {
      const existingItem = items.find(
        (item) => item.product._id === product._id
      );

      if (existingItem) {
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

  const removeFromCart = (productId: string) => {
    setCartItems((items) =>
      items.filter((item) => item.product._id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!Number.isInteger(quantity)) return;

    setCartItems((items) =>
      items.map((item) => {
        if (item.product._id !== productId) return item;

        const newQuantity = Math.max(
          1,
          Math.min(quantity, item.product.quantity)
        );

        return {
          ...item,
          quantity: newQuantity,
        };
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
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

export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
