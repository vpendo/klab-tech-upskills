
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Background from "../assets/image/background.jpg";
import { products } from "../data/product";
import ProductCard from "../Components/ProductCart";

const Home = () => {
  const newArrivals = [...products].reverse().slice(0, 4);

  const categories = [
    {
      name: "Shoes",
      description: "Step into your next favorite pair.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEyV-8R1k5IjFMe_KjIC-QF3K11J0SsqSrFimHgJ0NI-6pcsz7-mIOkeM&s=10",
    },
    {
      name: "Clothes",
      description: "Refresh your wardrobe with new styles.",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
    },
  ];

  return (
    <main className="bg-white">
      <section className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Background})` }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
              Welcome to PendoHub
            </p>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find Your <span className="text-orange-400">Perfect Style.</span>
            </h1>

            <p className="mb-10 max-w-xl text-lg leading-8 text-gray-200 sm:text-xl">
              Discover stylish clothes and shoes for every occasion.
              Express yourself with confidence.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-3 rounded-md bg-orange-600 px-8 py-4 font-semibold text-white transition duration-300 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-900/30"
            >
              Shop Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-600">
            Explore our collection
          </p>

          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Shop by Category
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${category.name}`}
              className="group relative h-72 overflow-hidden rounded-xl bg-gray-900 sm:h-96"
            >
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 p-7 sm:p-9">
                <h3 className="text-3xl font-bold text-white">
                  {category.name}
                </h3>

                <p className="mt-2 text-gray-200">
                  {category.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-2 font-semibold text-orange-400">
                  Explore Collection
                  <ArrowRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#FAF8F5]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-600">
                Discover something new
              </p>

              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                New Arrivals
              </h2>
            </div>

            <Link
              to="/shop"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-orange-600 transition hover:text-orange-700"
            >
              Shop All
              <ArrowRight size={18} />
            </Link>
          </div>

          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-gray-500">
              Products will appear here soon.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
