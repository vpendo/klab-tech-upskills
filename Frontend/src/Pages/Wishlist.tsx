import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Wishlist = () => {
  return (
    <section className="min-h-[50vh] flex flex-col items-center justify-center px-6 text-center">
      <Heart size={48} className="text-orange-600 mb-4" />

      <h1 className="text-3xl font-bold">Your Wishlist</h1>

      <p className="text-gray-500 mt-3">
        Your favorite products will appear here.
      </p>

      <Link
        to="/shop"
        className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
      >
        Continue Shopping
      </Link>
    </section>
  );
};

export default Wishlist;
