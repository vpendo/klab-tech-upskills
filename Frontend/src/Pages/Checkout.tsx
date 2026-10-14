import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "../Context/CartContext";

const Checkout = () => {
  const { cartItems, cartCount, subtotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <ShoppingBag size={56} className="text-orange-500 mb-4" />

        <h1 className="text-3xl font-bold text-gray-900">
          Your cart is empty
        </h1>

        <p className="text-gray-500 mt-3">
          Add some products before proceeding to checkout.
        </p>

        <Link
          to="/shop"
          className="mt-6 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/cart"
          className="mb-8 inline-flex items-center gap-2 text-gray-600 hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Checkout
        </h1>

        <p className="mb-8 text-gray-500">
          Review your order before completing checkout.
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order summary */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-5 text-xl font-bold">Order Summary</h2>

              {cartItems.map(({ product, quantity }) => (
                <div
                  key={product._id}
                  className="flex gap-4 border-b border-gray-100 py-4 last:border-0"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {product.gender} · {product.category}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Quantity: {quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    {(product.price * quantity).toLocaleString()} RWF
                  </p>
                </div>
              ))}
            </div>

            {/* Demo notice */}
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={24}
                  className="mt-1 shrink-0 text-orange-600"
                />

                <div>
                  <h3 className="font-bold text-gray-900">
                    Demo Checkout
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    You're testing PendoHub with sample data. Payments and
                    order placement are not enabled yet. No payment details
                    are required.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price summary */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-5 text-xl font-bold">Price Details</h2>

            <div className="flex justify-between text-gray-600">
              <span>Items ({cartCount})</span>
              <span>{subtotal.toLocaleString()} RWF</span>
            </div>

            <div className="mt-4 flex justify-between text-gray-600">
              <span>Delivery</span>
              <span>Not calculated</span>
            </div>

            <div className="my-5 border-t border-gray-200" />

            <div className="flex justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span className="text-orange-600">
                {subtotal.toLocaleString()} RWF
              </span>
            </div>

            <button
              type="button"
              disabled
              className="mt-6 w-full cursor-not-allowed rounded-lg bg-gray-300 px-5 py-3 font-semibold text-gray-600"
            >
              Checkout Coming Soon
            </button>

            <Link
              to="/shop"
              className="mt-4 block text-center text-sm font-medium text-orange-600 hover:underline"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
