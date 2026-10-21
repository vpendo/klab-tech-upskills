import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import type { Product } from "../Types/product";
import api from "../services/api";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  subtotal: number;
  cartLoading: boolean;
  cartError: string;
  refreshCart: () => Promise<void>;
}

interface CartResponse {
  items?: CartItem[];
  totalItems?: number;
  totalPrice?: number;
  message?: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "Unable to update your cart. Please try again."
    );
  }

  return "Unable to update your cart. Please try again.";
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");

  // Load the logged-in customer's cart from the backend.
  const refreshCart = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setCartItems([]);
      setCartLoading(false);
      setCartError("");
      return;
    }

    setCartLoading(true);
    setCartError("");

    try {
      const response = await api.get<CartResponse>("/api/cart");
      setCartItems(response.data.items ?? []);
    } catch (error) {
      setCartError(getErrorMessage(error));
      console.error("Load cart error:", error);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  // Add a product to the backend cart.
  const addToCart = async (product: Product, quantity = 1) => {
    if (!localStorage.getItem("token")) {
      setCartError("Please log in to add products to your cart.");
      return;
    }

    if (!product._id || !Number.isInteger(quantity) || quantity < 1) {
      setCartError("Please select a valid product quantity.");
      return;
    }

    setCartError("");

    try {
      await api.post("/api/cart/items", {
        productId: product._id,
        quantity,
      });

      await refreshCart();
    } catch (error) {
      setCartError(getErrorMessage(error));
      console.error("Add cart item error:", error);
    }
  };

  // Remove a product from the backend cart.
  const removeFromCart = async (productId: string) => {
    setCartError("");

    try {
      await api.delete(
        `/api/cart/items/${encodeURIComponent(productId)}`
      );

      setCartItems((items) =>
        items.filter((item) => item.product._id !== productId)
      );
    } catch (error) {
      setCartError(getErrorMessage(error));
      console.error("Remove cart item error:", error);
    }
  };

  // Update the quantity of a product in the backend cart.
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      setCartError("Quantity must be at least 1.");
      return;
    }

    setCartError("");

    try {
      await api.patch(
        `/api/cart/items/${encodeURIComponent(productId)}`,
        { quantity }
      );

      await refreshCart();
    } catch (error) {
      setCartError(getErrorMessage(error));
      console.error("Update cart quantity error:", error);
    }
  };

  // Clear the backend cart.
  const clearCart = async () => {
    setCartError("");

    try {
      await api.delete("/api/cart");
      setCartItems([]);
    } catch (error) {
      setCartError(getErrorMessage(error));
      console.error("Clear cart error:", error);
      await refreshCart();
    }
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
        cartLoading,
        cartError,
        refreshCart,
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