import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <Heart size={30} className="fill-orange-600 text-orange-600" />

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
                onClick={clearWishlist}
                className="text-sm font-medium text-gray-500 transition hover:text-red-600"
              >
                Clear Wishlist
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((product) => (
                <article
                  key={product._id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product._id)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      title="Remove from wishlist"
                      className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 hover:text-red-600"
                    >
                      <Heart
                        size={20}
                        className="fill-orange-600 text-orange-600"
                      />
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
                      {product.price.toLocaleString()} RWF
                    </p>

                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      disabled={product.quantity <= 0}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      <ShoppingCart size={17} />
                      {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product._id)}
                      className="mt-3 w-full text-sm font-medium text-gray-500 transition hover:text-red-600"
                    >
                      Remove
                      <Trash2 size={14} className="ml-1 inline" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Wishlist;