
import type { Product } from "./productService";

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = "pendohub-cart";

// Get cart items from localStorage
export const getCartItems = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) return [];

    return JSON.parse(savedCart) as CartItem[];
  } catch {
    return [];
  }
};

// Save cart items to localStorage
export const saveCartItems = (cartItems: CartItem[]): void => {
  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(cartItems)
  );
};

// Add a product to the cart
export const addToCart = (product: Product): CartItem[] => {
  const cartItems = getCartItems();

  // Do not add out-of-stock products
  if (product.quantity < 1) return cartItems;

  const existingItem = cartItems.find(
    (item) => item.product._id === product._id
  );

  let updatedCart: CartItem[];

  if (existingItem) {
    // Increase quantity if product already exists
    updatedCart = cartItems.map((item) =>
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
  } else {
    // Add new product
    updatedCart = [
      ...cartItems,
      {
        product,
        quantity: 1,
      },
    ];
  }

  saveCartItems(updatedCart);
  return updatedCart;
};

// Update a product's cart quantity
export const updateCartQuantity = (
  productId: string,
  quantity: number
): CartItem[] => {
  const cartItems = getCartItems();

  const updatedCart = cartItems.map((item) => {
    if (item.product._id !== productId) {
      return item;
    }

    return {
      ...item,
      quantity: Math.max(
        1,
        Math.min(quantity, item.product.quantity)
      ),
    };
  });

  saveCartItems(updatedCart);
  return updatedCart;
};

// Remove a product from the cart
export const removeFromCart = (
  productId: string
): CartItem[] => {
  const updatedCart = getCartItems().filter(
    (item) => item.product._id !== productId
  );

  saveCartItems(updatedCart);
  return updatedCart;
};

// Clear the entire cart
export const clearCart = (): void => {
  localStorage.removeItem(CART_STORAGE_KEY);
};

// Calculate the total number of items
export const getCartCount = (): number => {
  return getCartItems().reduce(
    (total, item) => total + item.quantity,
    0
  );
};

// Calculate the cart subtotal in RWF
export const getCartSubtotal = (): number => {
  return getCartItems().reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );
};
