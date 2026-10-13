import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Background from "../assets/image/background.jpg";

const About = () => {
  return (
    <main className="bg-white text-gray-900">
      {/* Hero with Background Image */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-black px-6 py-20 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Background})` }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-4 font-semibold uppercase tracking-[0.3em] text-orange-400">
            About Us
          </p>

          <h1 className="text-4xl font-extrabold text-white sm:text-6xl">
            Style That Speaks
            <span className="block text-orange-400">For You.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-200">
            Discover clothes and shoes for men and women that match your style
            and boost your confidence.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-orange-700 px-7 py-3 font-semibold text-white transition hover:bg-orange-800"
          >
            Shop Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* About PendoHub */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-700">
          Who We Are
        </p>

        <h2 className="text-3xl font-bold sm:text-4xl">
          Fashion Made Simple.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-600">
          PendoHub is your online destination for clothing and shoes. We bring
          styles for men and women together in one place, making it easier to
          find your next look.
        </p>

        <Link
          to="/contact"
          className="mt-7 inline-flex items-center gap-2 rounded-md bg-black px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
        >
          Contact Us
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
};

export default About;