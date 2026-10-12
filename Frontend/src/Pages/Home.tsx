import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Background from "../assets/image/background.jpg";

const Home = () => {
  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${Background})`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Find Your{" "}
            <span className="text-orange-400">Perfect Style.</span>
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-8 text-gray-200 sm:text-xl">
            Discover stylish clothes and shoes for every occasion.
            Express yourself with confidence.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-3 rounded-md bg-orange-800 px-8 py-4 font-semibold text-white transition duration-300 hover:bg-orange-900 hover:shadow-lg hover:shadow-orange-900/30"
          >
            Shop Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Home;