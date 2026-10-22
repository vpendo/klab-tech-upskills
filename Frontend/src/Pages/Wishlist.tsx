
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import api from "../services/api";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  gender: string;
  price: number;
  quantity: number;
  imageUrl: string;
  imagePublicId?: string;
}

interface WishlistResponse {
  products: Product[];
  count?: number;
  message?: string;
}

const IMAGE_PLACEHOLDER =
  "https://placehold.co/400x500?text=PendoHub";

const formatPrice = (price: number) =>
  `${price.toLocaleString("en-RW")} RWF`;

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "Something went wrong. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
};

const Wishlist = () => {
  const navigate = useNavigate();

  const isCustomerPage =
    window.location.pathname.startsWith("/account/");

  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchWishlist = useCallback(async () => {
    setError("");

    try {
      const response = await api.get<WishlistResponse>("/api/wishlist");
      setWishlistItems(response.data.products ?? []);
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        (err.response?.status === 401 ||
          err.response?.status === 403)
      ) {
        const savedUser = localStorage.getItem("user");

        if (!localStorage.getItem("token")) {
          navigate("/login", { replace: true });
          return;
        }

        try {
          const user = savedUser ? JSON.parse(savedUser) : null;

          if (user?.role === "admin") {
            navigate("/dashboard/admin", { replace: true });
            return;
          }
        } catch {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        setError(
          "You are not authorized to access the customer wishlist."
        );
        return;
      }

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      if (user.role !== "customer") {
        navigate(
          user.role === "admin" ? "/dashboard/admin" : "/login",
          { replace: true }
        );
        return;
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
      return;
    }

    void fetchWishlist();
  }, [fetchWishlist, navigate]);

  const removeFromWishlist = async (productId: string) => {
    setActionLoading(productId);
    setError("");
    setSuccessMessage("");

    try {
      await api.delete(
        `/api/wishlist/items/${encodeURIComponent(productId)}`
      );

      setWishlistItems((current) =>
        current.filter((product) => product._id !== productId)
      );

      setSuccessMessage("Product removed from your wishlist.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const clearWishlist = async () => {
    if (wishlistItems.length === 0) return;

    setActionLoading("clear");
    setError("");
    setSuccessMessage("");

    try {
      for (const product of wishlistItems) {
        await api.delete(
          `/api/wishlist/items/${encodeURIComponent(product._id)}`
        );
      }

      setWishlistItems([]);
      setSuccessMessage("Your wishlist has been cleared.");
    } catch (err) {
      setError(
        `${getErrorMessage(err)} Refresh your wishlist to check which products remain.`
      );

      await fetchWishlist();
    } finally {
      setActionLoading(null);
    }
  };

  const addToCart = async (product: Product) => {
    if (product.quantity <= 0) return;

    setActionLoading(product._id);
    setError("");
    setSuccessMessage("");

    try {
      await api.post("/api/cart/items", {
        productId: product._id,
        quantity: 1,
      });

      setSuccessMessage(`${product.name} added to your cart.`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <LoaderCircle
            size={36}
            className="mx-auto animate-spin text-orange-600"
          />
          <p className="mt-4 text-gray-600">
            Loading your wishlist...
          </p>
        </div>
      </main>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Navigation */}
        <div className="mb-6 flex justify-end">
          {isCustomerPage ? (
            <Link
              to="/account/cart"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              <ShoppingCart size={18} />
              My Cart
            </Link>
          ) : (
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Continue Shopping
              <ArrowRight size={18} />
            </Link>
          )}
        </div>

        {/* Wishlist heading */}
        <div className="mb-8 flex items-center gap-3">
          <Heart
            size={30}
            className="fill-orange-600 text-orange-600"
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Wishlist
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "product" : "products"} saved
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void fetchWishlist();
              }}
              className="ml-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {successMessage && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            {successMessage}
          </p>
        )}

        {wishlistItems.length === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
              <Heart size={38} className="text-orange-600" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-md text-gray-500">
              Save the products you love by clicking the heart icon on any
              product.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Continue Shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                onClick={() => void clearWishlist()}
                disabled={actionLoading !== null}
                className="text-sm font-medium text-gray-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading === "clear"
                  ? "Clearing..."
                  : "Clear Wishlist"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((product) => {
                const isBusy = actionLoading === product._id;

                return (
                  <article
                    key={product._id}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      <Link to={`/product/${product._id}`}>
                        <WishlistProductImage
                          src={product.imageUrl}
                          alt={product.name}
                        />
                      </Link>

                      <button
                        type="button"
                        onClick={() => void removeFromWishlist(product._id)}
                        disabled={actionLoading !== null}
                        aria-label={`Remove ${product.name} from wishlist`}
                        title="Remove from wishlist"
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 hover:text-red-600 disabled:opacity-50"
                      >
                        {isBusy ? (
                          <LoaderCircle
                            size={19}
                            className="animate-spin"
                          />
                        ) : (
                          <Heart
                            size={20}
                            className="fill-orange-600 text-orange-600"
                          />
                        )}
                      </button>

                      <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-800">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                        {product.gender} · {product.category}
                      </p>

                      <Link to={`/product/${product._id}`}>
                        <h2 className="mt-2 line-clamp-1 font-semibold text-gray-900 hover:text-orange-600">
                          {product.name}
                        </h2>
                      </Link>

                      <p className="mt-2 text-base font-bold text-gray-900 sm:text-lg">
                        {formatPrice(product.price)}
                      </p>

                      <button
                        type="button"
                        onClick={() => void addToCart(product)}
                        disabled={
                          product.quantity <= 0 || actionLoading !== null
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        {isBusy ? (
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <ShoppingCart size={17} />
                        )}

                        {product.quantity <= 0
                          ? "Out of Stock"
                          : isBusy
                            ? "Please wait..."
                            : "Add to Cart"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void removeFromWishlist(product._id)}
                        disabled={actionLoading !== null}
                        className="mt-3 w-full text-sm font-medium text-gray-500 transition hover:text-red-600 disabled:opacity-50"
                      >
                        Remove
                        <Trash2 size={14} className="ml-1 inline" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

function WishlistProductImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <img
      src={imageError || !src ? IMAGE_PLACEHOLDER : src}
      alt={alt}
      loading="lazy"
      onError={() => setImageError(true)}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
  );
}

export default Wishlist;
