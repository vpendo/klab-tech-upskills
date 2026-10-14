import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getProducts,
  type Product,
} from "../Services/productService";
import ProductCard from "../Components/ProductCart";

function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const gender = searchParams.get("gender");
  const search = searchParams.get("search")?.trim() ?? "";

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts(1, 50);

        if (isMounted) {
          setProducts(response.products);
        }
      } catch {
        if (isMounted) {
          setError(
            "Unable to load products. Please check your backend and try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !category || product.category === category;

    const matchesGender =
      !gender || product.gender === gender;

    const query = search.toLowerCase();

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

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
        PendoHub Collection
      </p>

      <h1 className="mt-2 text-3xl font-bold text-gray-900">
        {pageTitle}
      </h1>

      <p className="mt-2 text-gray-500">
        Discover styles you'll love.
      </p>

      {loading ? (
        <p className="py-16 text-center text-gray-500">
          Loading products...
        </p>
      ) : error ? (
        <div className="py-16 text-center">
          <p className="text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-semibold text-gray-800">
            No products found.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Try another search or choose a different category.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-gray-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default Shop;
