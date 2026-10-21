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

  return "Unable to update your wishlist. Please try again.";
};

export const WishlistProvider = ({
  children,
}: WishlistProviderProps) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState("");

  // Load the logged-in customer's wishlist from MongoDB through the API.
  const refreshWishlist = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setWishlistItems([]);
      setWishlistLoading(false);
      setWishlistError("");
      return;
    }

    setWishlistLoading(true);
    setWishlistError("");

    try {
      const response = await api.get<WishlistResponse>("/api/wishlist");
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

  // Add a product to the customer's MongoDB wishlist.
  const addToWishlist = async (product: Product) => {
    if (!localStorage.getItem("token")) {
      setWishlistError("Please log in to save products to your wishlist.");
      return;
    }

    setWishlistError("");

    try {
      await api.post("/api/wishlist/items", {
        productId: product._id,
      });

      await refreshWishlist();
    } catch (error) {
      setWishlistError(getErrorMessage(error));
      console.error("Add wishlist item error:", error);
    }
  };

  // Remove a product from the customer's MongoDB wishlist.
  const removeFromWishlist = async (productId: string) => {
    setWishlistError("");

    try {
      await api.delete(
        `/api/wishlist/items/${encodeURIComponent(productId)}`
      );

      setWishlistItems((currentItems) =>
        currentItems.filter((item) => item._id !== productId)
      );
    } catch (error) {
      setWishlistError(getErrorMessage(error));
      console.error("Remove wishlist item error:", error);
    }
  };

  // Toggle a product's wishlist status.
  const toggleWishlist = async (product: Product) => {
    const alreadyExists = wishlistItems.some(
      (item) => item._id === product._id
    );

    if (alreadyExists) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product);
    }
  };

  // Check whether a product is saved.
  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item._id === productId);

  // Clear the wishlist using the existing backend delete endpoint.
  const clearWishlist = async () => {
    setWishlistError("");

    const currentItems = [...wishlistItems];

    try {
      for (const product of currentItems) {
        await api.delete(
          `/api/wishlist/items/${encodeURIComponent(product._id)}`
        );
      }

      setWishlistItems([]);
    } catch (error) {
      setWishlistError(getErrorMessage(error));
      console.error("Clear wishlist error:", error);
      await refreshWishlist();
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