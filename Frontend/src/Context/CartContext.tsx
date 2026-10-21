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

interface StoredUser {
  role?: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "Unable to update your cart. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to update your cart. Please try again.";
};

// Only logged-in customers can access cart actions.
const checkCustomerAccess = (): void => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser) {
    throw new Error("Please log in to access your cart.");
  }

  try {
    const user = JSON.parse(savedUser) as StoredUser;

    if (user.role !== "customer") {
      throw new Error("Only customers can access the shopping cart.");
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Only customers can access the shopping cart."
    ) {
      throw error;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw new Error("Your session is invalid. Please log in again.");
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");

  // Load the logged-in customer's cart from the backend.
  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      setCartItems([]);
      setCartLoading(false);
      setCartError("");
      return;
    }

    try {
      const user = JSON.parse(savedUser) as StoredUser;

      if (user.role !== "customer") {
        setCartItems([]);
        setCartLoading(false);
        setCartError("");
        return;
      }
    } catch {
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
    try {
      checkCustomerAccess();

      if (!product._id || !Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Please select a valid product quantity.");
      }

      setCartError("");

      await api.post("/api/cart/items", {
        productId: product._id,
        quantity,
      });

      await refreshCart();
    } catch (error) {
      const message = getErrorMessage(error);
      setCartError(message);
      console.error("Add cart item error:", error);

      // Let the component know the action failed.
      throw new Error(message);
    }
  };

  // Remove a product from the backend cart.
  const removeFromCart = async (productId: string) => {
    try {
      checkCustomerAccess();
      setCartError("");

      await api.delete(
        `/api/cart/items/${encodeURIComponent(productId)}`
      );

      setCartItems((items) =>
        items.filter((item) => item.product._id !== productId)
      );
    } catch (error) {
      const message = getErrorMessage(error);
      setCartError(message);
      console.error("Remove cart item error:", error);
      throw new Error(message);
    }
  };

  // Update a product quantity in the backend cart.
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      checkCustomerAccess();

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Quantity must be at least 1.");
      }

      setCartError("");

      await api.patch(
        `/api/cart/items/${encodeURIComponent(productId)}`,
        { quantity }
      );

      await refreshCart();
    } catch (error) {
      const message = getErrorMessage(error);
      setCartError(message);
      console.error("Update cart quantity error:", error);
      throw new Error(message);
    }
  };

  // Clear the backend cart.
  const clearCart = async () => {
    try {
      checkCustomerAccess();
      setCartError("");

      await api.delete("/api/cart");
      setCartItems([]);
    } catch (error) {
      const message = getErrorMessage(error);
      setCartError(message);
      console.error("Clear cart error:", error);

      await refreshCart();
      throw new Error(message);
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