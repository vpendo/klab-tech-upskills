import { useSearchParams } from "react-router-dom";
import ProductCard from "../Components/ProductCart";
import { products } from "../data/product";

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const gender = searchParams.get("gender") ?? "";
  const search = searchParams.get("search")?.trim() ?? "";

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !category ||
      product.category.toLowerCase() === category.toLowerCase();

    const matchesGender =
      !gender ||
      product.gender.toLowerCase() === gender.toLowerCase();

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
              {filteredProducts.length}
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

        {filteredProducts.length === 0 ? (
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
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Shop;
