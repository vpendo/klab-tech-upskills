import {
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ShoppingBag,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { useCart } from "../Context/CartContext";
import api from "../services/api";

const formatPrice = (price: number) =>
  `${price.toLocaleString("en-RW")} RWF`;

const IMAGE_PLACEHOLDER =
  "https://placehold.co/400x500?text=PendoHub";

interface CheckoutForm {
  customerName: string;
  email: string;
  phone: string;
  address: string;
}

interface SavedUser {
  role?: string;
  name?: string;
  fullName?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface OrderResponse {
  message?: string;
  _id?: string;
  order?: {
    _id?: string;
  };
}

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    subtotal,
    cartLoading,
    cartError,
    refreshCart,
    clearCart,
  } = useCart();

  const [form, setForm] = useState<CheckoutForm>({
    customerName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [authChecked, setAuthChecked] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(savedUser) as SavedUser;

      if (user.role !== "customer") {
        navigate(
          user.role === "admin" ? "/dashboard/admin" : "/login",
          { replace: true }
        );
        return;
      }

      setForm({
        customerName:
          user.name || user.fullName || user.customerName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });

      setAuthChecked(true);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (placingOrder) return;

    setError("");

    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(savedUser) as SavedUser;

      if (user.role !== "customer") {
        navigate(
          user.role === "admin" ? "/dashboard/admin" : "/login",
          { replace: true }
        );
        return;
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      return;
    }

    if (cartLoading) {
      setError("Please wait while your cart finishes loading.");
      return;
    }

    if (cartError) {
      setError("Your cart could not be loaded. Please retry before placing your order.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty. Add products before placing an order.");
      return;
    }

    if (
      !form.customerName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim()
    ) {
      setError("Please complete all delivery details.");
      return;
    }

    setPlacingOrder(true);

    try {
      // If the API base URL already ends in /api, use "/orders" instead.
      const response = await api.post<OrderResponse>("/api/orders", {
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        items: cartItems.map(({ product, quantity }) => ({
          productId: product._id,
          quantity,
        })),
      });

      const orderId =
        response.data.order?._id || response.data._id;

      const message =
        response.data.message ||
        "Your order was placed successfully.";

      // The order already exists, so a cart-clearing error must not
      // be reported as an order-placement failure.
      try {
        await clearCart();
      } catch (clearError) {
        console.error(
          "The order was placed, but the cart could not be cleared:",
          clearError
        );

        try {
          await refreshCart();
        } catch (refreshError) {
          console.error("Unable to refresh the cart:", refreshError);
        }
      }

      navigate("/account/orders", {
        replace: true,
        state: {
          orderPlaced: true,
          orderId,
          message,
        },
      });
    } catch (err: unknown) {
      const responseMessage = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : null;

      setError(
        responseMessage ||
          (err instanceof Error
            ? err.message
            : "We couldn't place your order. Please try again.")
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!authChecked) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle
          size={36}
          className="animate-spin text-orange-500"
        />
        <span className="ml-3 text-gray-600">
          Checking your account...
        </span>
      </main>
    );
  }

  if (cartLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle
          size={36}
          className="animate-spin text-orange-500"
        />
        <span className="ml-3 text-gray-600">
          Loading your cart...
        </span>
      </main>
    );
  }

  if (cartError) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
        <AlertCircle size={40} className="text-red-500" />

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Unable to Load Your Cart
        </h1>

        <p className="mt-3 max-w-md text-gray-500">
          We couldn't retrieve your cart. Check your connection and try again.
        </p>

        <button
          type="button"
          onClick={() => {
            setError("");
            void refreshCart();
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
        >
          Retry Loading Cart
        </button>

        <Link
          to="/account"
          className="mt-4 text-sm font-semibold text-gray-600 hover:text-orange-600"
        >
          Back to Dashboard
        </Link>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
        <ShoppingBag size={40} className="text-orange-500" />

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Your cart is empty
        </h1>

        <p className="mt-3 max-w-md text-gray-500">
          Add products to your cart before proceeding to checkout.
        </p>

        <Link
          to="/account"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <Link
          to="/shop"
          className="mt-3 text-sm font-semibold text-orange-600 hover:underline"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/account/cart"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            PendoHub Shopping
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Enter your delivery details to place your order. No payment is required.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form
          onSubmit={handlePlaceOrder}
          className="grid items-start gap-8 lg:grid-cols-3"
        >
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Delivery Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="customerName"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="customerName"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    disabled={placingOrder}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    disabled={placingOrder}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    disabled={placingOrder}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    autoComplete="street-address"
                    rows={3}
                    disabled={placingOrder}
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                    placeholder="Enter your delivery address, district, and city"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Order Items
              </h2>

              {cartItems.map(({ product, quantity }) => (
                <div
                  key={product._id}
                  className="flex gap-4 border-b border-gray-100 py-4 last:border-0"
                >
                  <CheckoutProductImage
                    src={product.imageUrl}
                    alt={product.name}
                  />

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${product._id}`}
                      className="font-semibold text-gray-900 transition hover:text-orange-600"
                    >
                      {product.name}
                    </Link>

                    <p className="mt-1 text-sm text-gray-500">
                      {product.gender} · {product.category}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Quantity: {quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-gray-900">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
              ))}
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-4 text-gray-600">
                <span>Items ({cartCount})</span>
                <span className="text-right">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-gray-600">
                <span>Delivery</span>
                <span className="text-right text-sm">
                  Confirmed separately
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between gap-4 text-lg font-bold">
                  <span>Order Subtotal</span>
                  <span className="text-right text-orange-600">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Payment is not collected on this page. Your order will be submitted with a Pending status.
              </p>
            </div>

            <button
              type="submit"
              disabled={placingOrder || cartLoading || cartItems.length === 0}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {placingOrder ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <ShoppingBag size={19} />
                  Place Order
                </>
              )}
            </button>

            <Link
              to="/account/cart"
              className="mt-4 block text-center text-sm font-medium text-gray-600 transition hover:text-orange-600"
            >
              Edit Cart
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
};

function CheckoutProductImage({
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
      className="h-24 w-20 shrink-0 rounded-xl bg-gray-100 object-cover sm:h-28 sm:w-24"
    />
  );
}

export default Checkout;
