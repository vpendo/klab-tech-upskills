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
      <main className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Product not found
        </h1>

        <p className="mt-2 text-gray-500">
          This product may no longer be available.
        </p>

        <Link
          to="/shop"
          className="mt-4 inline-flex items-center text-orange-600 transition hover:underline"
        >
          <ArrowLeft className="mr-1" size={16} />
          Back to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <Link
        to="/shop"
        className="mb-8 inline-flex items-center gap-2 text-gray-600 transition hover:text-orange-600"
      >
        <ArrowLeft size={18} />
        Back to Shop
      </Link>

      <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10">
        <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl bg-gray-100 sm:min-h-[460px]">
          {imageError ? (
            <div className="p-6 text-center text-gray-500">
              <ShoppingCart size={36} className="mx-auto mb-3 text-gray-400" />
              <p>Product image unavailable</p>
            </div>
          ) : (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-[360px] w-full object-cover transition duration-500 hover:scale-105 sm:h-[460px]"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        <div className="py-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            {product.gender} / {product.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-5 text-2xl font-bold text-gray-900">
            {product.price.toLocaleString()} RWF
          </p>

          <p className="mt-5 leading-7 text-gray-600">
            {product.description}
          </p>

          <p
            className={`mt-5 text-sm font-medium ${
              product.quantity > 0
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {product.quantity > 0
              ? `${product.quantity} available`
              : "Out of stock"}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.quantity <= 0}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
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
    </main>
  );
};

export default ProductDetails;
