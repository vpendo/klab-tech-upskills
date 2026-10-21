
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        // Fetch products saved in MongoDB.
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
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="border-b border-gray-100 pb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {pageTitle}
          </h1>

          <p className="mt-3 text-gray-500">
            Discover styles you'll love.
          </p>
        </header>

        <div className="flex items-center justify-between py-7">
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

        {loading ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-500">
              Loading products...
            </p>
          </div>
        ) : error ? (
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
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Shop;
