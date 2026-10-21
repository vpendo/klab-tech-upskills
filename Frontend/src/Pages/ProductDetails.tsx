
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { getProductById } from "../services/productService";
import type { Product } from "../Types/product";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      if (!id) {
        setProduct(null);
        setError("A product ID was not provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setProduct(null);
      setAdded(false);
      setImageError(false);

      try {
        const result = await getProductById(id);

        if (!cancelled) {
          setProduct(result);
        }
      } catch {
        if (!cancelled) {
          setError(
            "We couldn't load this product. It may no longer be available."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login");
      return;
    }

    let user: { role?: string };

    try {
      user = JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    if (user.role !== "customer") {
      navigate(user.role === "admin" ? "/dashboard/admin" : "/login");
      return;
    }

    if (!product || product.quantity <= 0 || adding) {
      return;
    }

    setAdding(true);

    try {
      await addToCart(product);
      setAdded(true);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-gray-500">Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Product not found
        </h1>

        <p className="mt-2 text-gray-500">
          {error || "This product may no longer be available."}
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
        <Link
          to="/shop"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to Shop
        </Link>

        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
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

            <p
              className={`mt-6 text-sm font-medium ${
                product.quantity > 0 ? "text-green-700" : "text-red-600"
              }`}
            >
              {product.quantity > 0
                ? `${product.quantity} available`
                : "Out of stock"}
            </p>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.quantity <= 0 || adding}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-semibold text-white transition sm:w-auto ${
                product.quantity <= 0 || adding
                  ? "cursor-not-allowed bg-gray-300"
                  : added
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {product.quantity <= 0 ? (
                "Out of Stock"
              ) : adding ? (
                "Adding..."
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
