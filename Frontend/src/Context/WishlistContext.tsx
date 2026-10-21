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

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
  wishlistCount: number;
  wishlistLoading: boolean;
  wishlistError: string;
  refreshWishlist: () => Promise<void>;
}

interface WishlistResponse {
  products?: Product[];
  message?: string;
}

interface StoredUser {
  role?: string;
}

const WishlistContext = createContext<
  WishlistContextType | undefined
>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "Unable to update your wishlist. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to update your wishlist. Please try again.";
};

// Only logged-in customers can use the wishlist.
const checkCustomerAccess = (): void => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser) {
    throw new Error("Please log in to access your wishlist.");
  }

  let user: StoredUser;

  try {
    user = JSON.parse(savedUser) as StoredUser;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw new Error("Your session is invalid. Please log in again.");
  }

  if (user.role !== "customer") {
    throw new Error("Only customers can access the wishlist.");
  }
};

export const WishlistProvider = ({
  children,
}: WishlistProviderProps) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState("");

  // Load the logged-in customer's wishlist from the backend.
  const refreshWishlist = useCallback(async () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      setWishlistItems([]);
      setWishlistLoading(false);
      setWishlistError("");
      return;
    }

    try {
      const user = JSON.parse(savedUser) as StoredUser;

      if (user.role !== "customer") {
        setWishlistItems([]);
        setWishlistLoading(false);
        setWishlistError("");
        return;
      }
    } catch {
      setWishlistItems([]);
      setWishlistLoading(false);
      setWishlistError("");
      return;
    }

    setWishlistLoading(true);
    setWishlistError("");

    try {
      const response = await api.get<WishlistResponse>(
        "/api/wishlist"
      );

      setWishlistItems(response.data.products ?? []);
    } catch (error) {
      setWishlistError(getErrorMessage(error));
      console.error("Load wishlist error:", error);
    } finally {
      setWishlistLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshWishlist();
  }, [refreshWishlist]);

  // Add a product to the customer's wishlist.
  const addToWishlist = async (product: Product) => {
    try {
      checkCustomerAccess();

      if (!product._id) {
        throw new Error("Invalid product.");
      }

      setWishlistError("");

      await api.post("/api/wishlist/items", {
        productId: product._id,
      });

      await refreshWishlist();
    } catch (error) {
      const message = getErrorMessage(error);
      setWishlistError(message);
      console.error("Add wishlist item error:", error);

      throw new Error(message);
    }
  };

  // Remove a product from the customer's wishlist.
  const removeFromWishlist = async (productId: string) => {
    try {
      checkCustomerAccess();
      setWishlistError("");

      await api.delete(
        `/api/wishlist/items/${encodeURIComponent(productId)}`
      );

      setWishlistItems((currentItems) =>
        currentItems.filter((item) => item._id !== productId)
      );
    } catch (error) {
      const message = getErrorMessage(error);
      setWishlistError(message);
      console.error("Remove wishlist item error:", error);

      throw new Error(message);
    }
  };

  // Add or remove a product from the wishlist.
  const toggleWishlist = async (product: Product) => {
    try {
      checkCustomerAccess();

      const alreadyExists = wishlistItems.some(
        (item) => item._id === product._id
      );

      if (alreadyExists) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      setWishlistError(message);
      throw new Error(message);
    }
  };

  // Check whether a product is saved.
  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item._id === productId);

  // Clear the wishlist using the existing backend endpoints.
  const clearWishlist = async () => {
    try {
      checkCustomerAccess();
      setWishlistError("");

      const currentItems = [...wishlistItems];

      for (const product of currentItems) {
        await api.delete(
          `/api/wishlist/items/${encodeURIComponent(product._id)}`
        );
      }

      setWishlistItems([]);
    } catch (error) {
      const message = getErrorMessage(error);
      setWishlistError(message);
      console.error("Clear wishlist error:", error);

      await refreshWishlist();
      throw new Error(message);
    }
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
        wishlistLoading,
        wishlistError,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside a WishlistProvider"
    );
  }

  return context;
};
