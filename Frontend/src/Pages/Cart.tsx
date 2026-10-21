import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Trash2,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { useCart } from "../Context/CartContext";

const formatPrice = (price: number) =>
  `${price.toLocaleString("en-RW")} RWF`;

const IMAGE_PLACEHOLDER =
  "https://placehold.co/400x500?text=PendoHub";

function Cart() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCustomerPage = location.pathname.startsWith("/account/");

  const {
    cartItems,
    cartCount,
    subtotal,
    cartLoading,
    cartError,
    refreshCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const [authChecked, setAuthChecked] = useState(false);

  // Only logged-in customers can use the cart.
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

      setAuthChecked(true);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (!authChecked) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <LoaderCircle
          size={36}
          className="animate-spin text-orange-500"
        />
      </main>
    );
  }

  const navigationLinks = (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      {isCustomerPage ? (
        <Link
          to="/account"
          className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      ) : (
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
      )}

      {isCustomerPage && (
        <Link
          to="/account/wishlist"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          <Heart size={18} />
          My Wishlist
        </Link>
      )}
    </div>
  );

  if (cartLoading) {
    return (
      <main className="min-h-[60vh] bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {navigationLinks}

          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-center">
              <LoaderCircle
                size={36}
                className="mx-auto animate-spin text-orange-500"
              />
              <p className="mt-4 font-medium text-gray-600">
                Loading your shopping cart...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-[60vh] bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {navigationLinks}

          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
                <ShoppingBag
                  size={36}
                  className="text-orange-500"
                />
              </div>

              <h1 className="mt-6 text-3xl font-bold text-gray-900">
                {cartError
                  ? "Unable to load your cart"
                  : "Your cart is empty"}
              </h1>

              <p className="mt-3 leading-6 text-gray-500">
                {cartError
                  ? "We couldn't retrieve your cart. Please try again."
                  : "Discover your next favorite outfit at PendoHub."}
              </p>

              {cartError && (
                <div
                  role="alert"
                  className="mt-4 text-sm text-red-600"
                >
                  {cartError}
                </div>
              )}

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                {cartError && (
                  <button
                    type="button"
                    onClick={() => void refreshCart()}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <RefreshCw size={17} />
                    Try Again
                  </button>
                )}

                <Link
                  to={isCustomerPage ? "/account" : "/shop"}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  {isCustomerPage
                    ? "Back to Dashboard"
                    : "Continue Shopping"}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {navigationLinks}

        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            PendoHub Shopping
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Your Shopping Cart
          </h1>

          <p className="mt-2 text-gray-500">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
          </p>
        </header>

        {cartError && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{cartError}</p>
            <button
              type="button"
              onClick={() => void refreshCart()}
              className="shrink-0 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-3">
          <section
            aria-label="Shopping cart items"
            className="space-y-4 lg:col-span-2"
          >
            {cartItems.map(({ product, quantity }) => {
              const productId = product._id;
              const stock = product.quantity;

              return (
                <article
                  key={productId}
                  className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:gap-6"
                >
                  <Link
                    to={`/product/${productId}`}
                    aria-label={`View ${product.name}`}
                    className="h-32 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-40 sm:w-36"
                  >
                    <CartProductImage
                      src={product.imageUrl}
                      alt={product.name}
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                      {product.gender} · {product.category}
                    </p>

                    <Link
                      to={`/product/${productId}`}
                      className="mt-1 line-clamp-2 font-semibold text-gray-900 transition hover:text-orange-600"
                    >
                      {product.name}
                    </Link>

                    <p className="mt-2 font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Item total: {formatPrice(product.price * quantity)}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                      <div className="flex items-center rounded-lg border border-gray-200">
                        <button
                          type="button"
                          onClick={() =>
                            void updateQuantity(productId, quantity - 1)
                          }
                          disabled={quantity <= 1}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className="rounded-l-lg p-2.5 text-gray-700 transition hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="min-w-9 text-center text-sm font-semibold">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            void updateQuantity(productId, quantity + 1)
                          }
                          disabled={quantity >= stock || stock < 1}
                          aria-label={`Increase quantity of ${product.name}`}
                          className="rounded-r-lg p-2.5 text-gray-700 transition hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => void removeFromCart(productId)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 transition hover:text-red-700"
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>

                    {quantity >= stock && stock > 0 && (
                      <p className="mt-2 text-xs text-gray-500">
                        Maximum available stock reached.
                      </p>
                    )}

                    {stock < 1 && (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        Currently out of stock. Remove this item to continue.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 pt-3 font-semibold text-gray-700 transition hover:text-orange-600"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </section>

          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-4 text-gray-600">
                <span>
                  Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})
                </span>

                <span className="text-right font-medium text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-gray-600">
                <span>Shipping</span>
                <span className="text-right text-sm">
                  Calculated at checkout
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-gray-900">
                    Subtotal
                  </span>
                  <span className="text-xl font-bold text-orange-600">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-7 block rounded-lg bg-orange-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CartProductImage({
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
      className="h-full w-full object-cover transition duration-300 hover:scale-105"
    />
  );
}

export default Cart;
