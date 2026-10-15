import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { products } from "../data/product";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find((item) => item._id === id);

  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setAdded(false);
    setImageError(false);
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.quantity <= 0) return;

    addToCart(product);
    setAdded(true);
  };

  if (!product) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Product not found
        </h1>

        <p className="mt-2 text-gray-500">
          This product may no longer be available.
        </p>

        <Link
          to="/shop"
          className="mt-5 inline-flex items-center gap-2 font-medium text-orange-600 transition hover:text-orange-700 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Back to shop */}
        <Link
          to="/shop"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to Shop
        </Link>

        {/* Product details */}
        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
          {/* Product image */}
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gray-50">
            {imageError || !product.imageUrl ? (
              <div className="p-6 text-center text-gray-500">
                <ShoppingCart
                  size={40}
                  className="mx-auto mb-3 text-gray-400"
                />
                <p>Product image unavailable</p>
              </div>
            ) : (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-contain p-4 transition duration-300 hover:scale-105 sm:p-6"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {/* Product information */}
          <div className="py-2 md:py-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
              {product.gender} / {product.category}
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl font-bold text-gray-900">
              {product.price.toLocaleString()} RWF
            </p>

            <div className="my-6 border-t border-gray-100" />

            <h2 className="text-sm font-semibold text-gray-900">
              Product description
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {product.description}
            </p>

            {/* Stock status */}
            <p
              className={`mt-6 text-sm font-medium ${
                product.quantity > 0
                  ? "text-green-700"
                  : "text-red-600"
              }`}
            >
              {product.quantity > 0
                ? `${product.quantity} available`
                : "Out of stock"}
            </p>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.quantity <= 0}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-semibold text-white transition sm:w-auto ${
                product.quantity <= 0
                  ? "cursor-not-allowed bg-gray-300"
                  : added
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {product.quantity <= 0 ? (
                "Out of Stock"
              ) : added ? (
                <>
                  <Check size={20} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  Add to Cart
                </>
              )}
            </button>

            <p className="mt-4 text-sm text-gray-500">
              Prices are displayed in Rwandan francs (RWF).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
