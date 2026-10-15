
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowUpRight, Check } from "lucide-react";
import type { Product } from "../Types/product";
import { useCart } from "../Context/CartContext";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.quantity <= 0;

  useEffect(() => {
    if (!added) return;

    const timeout = window.setTimeout(() => {
      setAdded(false);
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [added]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(product);
    setAdded(true);
  };

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        to={`/product/${product._id}`}
        className="relative block aspect-[4/5] overflow-hidden bg-gray-100"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-800">
          {product.category}
        </span>

        {isOutOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-md bg-white px-4 py-2 text-sm font-bold text-gray-900">
              Out of Stock
            </span>
          </span>
        )}

        <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-gray-900 opacity-0 shadow-md transition group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={20} />
        </span>
      </Link>

      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
          {product.gender} · {product.category}
        </p>

        <Link to={`/product/${product._id}`}>
          <h3 className="mt-2 line-clamp-1 font-semibold text-gray-900 transition hover:text-orange-600">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 text-lg font-bold text-gray-900">
          {product.price.toLocaleString()} RWF
        </p>

        <p
          className={`mt-1 text-sm ${
            isOutOfStock ? "text-red-600" : "text-green-700"
          }`}
        >
          {isOutOfStock
            ? "Out of stock"
            : `${product.quantity} available`}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          {isOutOfStock ? (
            "Unavailable"
          ) : added ? (
            <>
              <Check size={18} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
