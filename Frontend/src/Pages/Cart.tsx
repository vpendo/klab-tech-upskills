import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCart } from "../Context/CartContext";

const formatPrice = (price: number) =>
  `${price.toLocaleString("en-RW")} RWF`;

const IMAGE_PLACEHOLDER =
  "https://placehold.co/400x500?text=PendoHub";

function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    cartCount,
  } = useCart();

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16">
        <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
            <ShoppingBag size={36} className="text-orange-500" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-3 leading-6 text-gray-500">
            Discover your next favorite outfit and find
            something you love at PendoHub.
          </p>

          <Link
            to="/shop"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-7 py-3 font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
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

        <div className="grid items-start gap-8 lg:grid-cols-3">
          {/* Cart products */}
          <section
            aria-label="Shopping cart items"
            className="space-y-4 lg:col-span-2"
          >
            {cartItems.map((item) => {
              const product = item.product;
              const stock = product.quantity;
              const isMaxStock = item.quantity >= stock;

              return (
                <article
                  key={product._id}
                  className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:gap-6"
                >
                  {/* Product image */}
                  <Link
                    to={`/product/${product._id}`}
                    aria-label={`View ${product.name}`}
                    className="h-32 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-40 sm:w-36"
                  >
                    <CartProductImage
                      src={product.imageUrl}
                      alt={product.name}
                    />
                  </Link>

                  {/* Product details */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                      {product.gender} · {product.category}
                    </p>

                    <Link
                      to={`/product/${product._id}`}
                      className="mt-1 line-clamp-2 font-semibold text-gray-900 transition hover:text-orange-600"
                    >
                      {product.name}
                    </Link>

                    <p className="mt-2 font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Item total:{" "}
                      {formatPrice(product.price * item.quantity)}
                    </p>

                    {/* Quantity controls */}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                      <div className="flex items-center rounded-lg border border-gray-200">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className="rounded-l-lg p-2.5 text-gray-700 transition hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus size={15} />
                        </button>

                        <span
                          aria-live="polite"
                          className="min-w-9 text-center text-sm font-semibold"
                        >
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              item.quantity + 1
                            )
                          }
                          disabled={isMaxStock || stock < 1}
                          aria-label={`Increase quantity of ${product.name}`}
                          className="rounded-r-lg p-2.5 text-gray-700 transition hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product._id)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 transition hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>

                    {isMaxStock && stock > 0 && (
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

          {/* Order summary */}
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-4 text-gray-600">
                <span>
                  Subtotal ({cartCount}{" "}
                  {cartCount === 1 ? "item" : "items"})
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
              className="mt-7 block rounded-lg bg-orange-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Proceed to Checkout
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              Your cart is saved in this browser. Checkout and order
              placement must be implemented separately.
            </p>
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
