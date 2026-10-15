import { useSearchParams } from "react-router-dom";
import ProductCard from "../Components/ProductCart";
import type { Product } from "../Types/product";

const sampleProducts: Product[] = [
  {
    _id: "sample-1",
    name: "Classic White Sneakers",
    description: "Comfortable white sneakers for everyday wear.",
    category: "Shoes",
    gender: "Women",
    price: 25000,
    quantity: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    imagePublicId: "",
  },
  {
    _id: "sample-2",
    name: "Black Running Sneakers",
    description: "Lightweight sneakers for an active lifestyle.",
    category: "Shoes",
    gender: "Men",
    price: 30000,
    quantity: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600",
    imagePublicId: "",
  },
  {
    _id: "sample-3",
    name: "Casual Denim Jacket",
    description: "A timeless denim jacket for a casual look.",
    category: "Clothes",
    gender: "Women",
    price: 35000,
    quantity: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600",
    imagePublicId: "",
  },
  {
    _id: "sample-4",
    name: "Classic Casual Shirt",
    description: "A versatile shirt for everyday style.",
    category: "Clothes",
    gender: "Men",
    price: 20000,
    quantity: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600",
    imagePublicId: "",
  },
  {
    _id: "sample-5",
    name: "Everyday Fashion Sneakers",
    description: "Modern sneakers that pair with any casual outfit.",
    category: "Shoes",
    gender: "Women",
    price: 28000,
    quantity: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600",
    imagePublicId: "",
  },
  {
    _id: "sample-6",
    name: "Men's Casual Outfit",
    description: "Comfortable everyday clothing with a modern fit.",
    category: "Clothes",
    gender: "Men",
    price: 32000,
    quantity: 7,
    imageUrl:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600",
    imagePublicId: "",
  },
  {
    _id: "sample-7",
    name: "Minimal White Sneakers",
    description: "Clean, versatile sneakers for everyday outfits.",
    category: "Shoes",
    gender: "Men",
    price: 27000,
    quantity: 11,
    imageUrl:
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=600",
    imagePublicId: "",
  },
  {
    _id: "sample-8",
    name: "Women's Casual Top",
    description: "A stylish top for casual and smart-casual looks.",
    category: "Clothes",
    gender: "Women",
    price: 18000,
    quantity: 14,
    imageUrl:
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600",
    imagePublicId: "",
  },
];

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const gender = searchParams.get("gender") ?? "";
  const search = searchParams.get("search")?.trim() ?? "";

  const filteredProducts = sampleProducts.filter((product) => {
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
        {/* Page heading */}
        <header className="border-b border-gray-100 pb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {pageTitle}
          </h1>

          <p className="mt-3 text-gray-500">
            Discover styles you'll love.
          </p>
        </header>

        {/* Product count */}
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

        {/* Product grid */}
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
