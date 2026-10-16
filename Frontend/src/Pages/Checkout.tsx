import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "../Context/CartContext";

const formatPrice = (price: number) =>
  `${price.toLocaleString("en-RW")} RWF`;

const IMAGE_PLACEHOLDER =
  "https://placehold.co/400x500?text=PendoHub";

const Checkout = () => {
  const { cartItems, cartCount, subtotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
          <ShoppingBag size={40} className="text-orange-500" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Your cart is empty
        </h1>

        <p className="mt-3 max-w-md text-gray-500">
          Add some products to your cart before proceeding to checkout.
        </p>

        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
        >
          <ShoppingBag size={18} />
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Back to cart */}
        <Link
          to="/cart"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        {/* Page heading */}
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            PendoHub Shopping
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Review your order details and total.
          </p>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-3">
          {/* Order details */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Order Summary
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

                    <p className="mt-2 text-sm font-medium text-gray-900 sm:hidden">
                      {formatPrice(product.price * quantity)}
                    </p>
                  </div>

                  <p className="hidden shrink-0 text-sm font-semibold text-gray-900 sm:block">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
              ))}
            </section>
          </div>

          {/* Price details */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-gray-900">
              Price Details
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
                  Not calculated
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between gap-4 text-lg font-bold">
                  <span>Subtotal</span>

                  <span className="text-right text-orange-600">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="mt-6 w-full cursor-not-allowed rounded-lg bg-gray-300 px-5 py-3 font-semibold text-gray-600"
            >
              Order Placement 
            </button>

            <Link
              to="/cart"
              className="mt-4 block text-center text-sm font-medium text-gray-600 transition hover:text-orange-600"
            >
              Edit Cart
            </Link>

            <Link
              to="/shop"
              className="mt-3 block text-center text-sm font-medium text-orange-600 hover:underline"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
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
