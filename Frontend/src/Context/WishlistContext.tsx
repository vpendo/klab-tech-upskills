import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../Types/product";

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const STORAGE_KEY = "pendohub-wishlist";

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider = ({
  children,
}: WishlistProviderProps) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
    try {
      const savedWishlist = localStorage.getItem(STORAGE_KEY);

      return savedWishlist ? (JSON.parse(savedWishlist) as Product[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product: Product) => {
    setWishlistItems((currentItems) => {
      const alreadyExists = currentItems.some(
        (item) => item._id === product._id
      );

      if (alreadyExists) return currentItems;

      return [...currentItems, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((currentItems) =>
      currentItems.filter((item) => item._id !== productId)
    );
  };

  const toggleWishlist = (product: Product) => {
    setWishlistItems((currentItems) => {
      const alreadyExists = currentItems.some(
        (item) => item._id === product._id
      );

      if (alreadyExists) {
        return currentItems.filter((item) => item._id !== product._id);
      }

      return [...currentItems, product];
    });
  };

  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item._id === productId);

  const clearWishlist = () => {
    setWishlistItems([]);
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