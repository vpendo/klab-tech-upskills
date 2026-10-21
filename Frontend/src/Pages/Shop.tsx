import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

import ProductCard from "../Components/ProductCart";
import { getProducts } from "../services/productService";
import type { Product } from "../Types/product";

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const category = searchParams.get("category") ?? "";
  const gender = searchParams.get("gender") ?? "";
  const search = searchParams.get("search")?.trim() ?? "";

  // Identify a logged-in customer without redirecting them away from the shop.
  const isCustomer = (() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      return false;
    }

    try {
      const user = JSON.parse(savedUser);
      return user.role === "customer";
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await getProducts({ limit: 50 });

        if (!cancelled) {
          setProducts(response.products);
        }
      } catch {
        if (!cancelled) {
          setError(
            "We couldn't load products. Please check your connection and try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const query = search.toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !category ||
      product.category.toLowerCase() === category.toLowerCase();

    const matchesGender =
      !gender ||
      product.gender.toLowerCase() === gender.toLowerCase();

    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.gender.toLowerCase().includes(query);

    return matchesCategory && matchesGender && matchesSearch;
  });

  const pageTitle = search
    ? `Search: ${search}`
    : `${gender ? `${gender}'s ` : ""}${category || "Shop All"}`;

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Customer navigation */}
        {isCustomer && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/account"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </Link>

            <Link
              to="/account"
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
            >
              <LayoutDashboard size={18} />
              My Account
            </Link>
          </div>
        )}

        {/* Page heading */}
        <header className="border-b border-gray-100 pb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {pageTitle}
          </h1>

          <p className="mt-3 text-gray-500">
            Discover styles you'll love.
          </p>
        </header>

        {/* Product count and filters */}
        <div className="flex items-center justify-between gap-4 py-7">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">
              {loading ? "..." : filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
          </p>

          {(category || gender || search) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-orange-700 transition hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />
            <p className="mt-4 text-sm text-gray-500">
              Loading products...
            </p>
          </div>
        ) : error ? (
          /* Error state */
          <div className="py-16 text-center">
            <h2 className="text-lg font-semibold">
              Unable to load products
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-orange-700 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-800"
            >
              Try again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty state */
          <div className="py-16 text-center">
            <h2 className="text-lg font-semibold">
              No products found.
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or choose a different category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-orange-700 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-800"
            >
              View all products
            </button>
          </div>
        ) : (
          /* Product grid */
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Return to dashboard at the bottom */}
        {isCustomer && !loading && !error && (
          <div className="mt-12 flex justify-center border-t border-gray-100 pt-8">
            <Link
              to="/account"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <LayoutDashboard size={18} />
              Return to My Dashboard
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default Shop;
