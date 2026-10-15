import { useSearchParams } from "react-router-dom";
import ProductCard from "../Components/ProductCart";
import type { Product } from "../Types/product";

const sampleProducts: Product[] = [
  {
    _id: "1",
    name: "Classic White Sneakers",
    description: "Comfortable white sneakers for everyday wear.",
    category: "Shoes",
    gender: "Women",
    price: 25000,
    quantity: 15,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEyV-8R1k5IjFMe_KjIC-QF3K11J0SsqSrFimHgJ0NI-6pcsz7-mIOkeM&s=10",
    imagePublicId: "",
  },
  {
    _id: "2",
    name: "White Running Sneakers",
    description: "Lightweight sneakers for an active lifestyle.",
    category: "Shoes",
    gender: "Men",
    price: 30000,
    quantity: 10,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNlzlOJOOCoBmvJfXs96lbxc5XwL16hQsJvKaEzmucwg&s=10",
    imagePublicId: "",
  },
  {
    _id: "3",
    name: "Casual Denim Jacket",
    description: "A timeless denim jacket for a casual look.",
    category: "Clothes",
    gender: "Women",
    price: 15000,
    quantity: 8,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMLmqb5Qtb-yy6-FOEQccN6AMZirQzdOfqLztaVdHxnA&s=10",
    imagePublicId: "",
  },
  {
    _id: "4",
    name: "Classic Casual Shirt",
    description: "A versatile shirt for everyday style.",
    category: "Clothes",
    gender: "Men",
    price: 15000,
    quantity: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600",
    imagePublicId: "",
  },
  {
    _id: "5",
    name: "Everyday Fashion Sneakers",
    description: "Modern sneakers that pair with any casual outfit.",
    category: "Shoes",
    gender: "Women",
    price: 28000,
    quantity: 9,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-Yl6Cv__ND6lVyKUFO_OiumjfT4UWWIF9vo2Z2MZr6sEDygcXMoqUTLU&s=10",
    imagePublicId: "",
  },
  {
    _id: "6",
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
    _id: "7",
    name: "Black",
    description: "Fleet Men's Oxford Shoes (Richelieu) Black.",
    category: "Shoes",
    gender: "Men",
    price: 27000,
    quantity: 11,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXByZFw_9UixyrCrbKf5fTrg_XeR48nj-xAA2YpryqtQ&s=10",
    imagePublicId: "",
  },
  {
    _id: "8",
    name: "Women's dress",
    description: "A wonen dress for ceremony",
    category: "Clothes",
    gender: "Women",
    price: 18000,
    quantity: 14,
    imageUrl:
      "https://i.pinimg.com/236x/2a/17/1a/2a171a85767509117394054d4002eef0.jpg",
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
