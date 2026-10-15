
import { Link } from "react-router-dom";
import { ArrowRight, Shirt, Users, ShoppingBag } from "lucide-react";
import Background from "../assets/image/background.jpg";

const About = () => {
  const cards = [
    {
      icon: Shirt,
      text: "PendoHub is your online destination for clothing and shoes.",
    },
    {
      icon: Users,
      text: "We bring styles for men and women together in one place.",
    },
    {
      icon: ShoppingBag,
      text: "Making it easier to find your next look.",
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-20 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Background})` }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold text-white sm:text-6xl">
            Style That Speaks
            <span className="block text-orange-400">For You.</span>
          </h1>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-orange-700 px-7 py-3 font-semibold text-white transition hover:bg-orange-800"
          >
            Shop Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Who We Are
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.text}
                className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-lg"
              >
                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-orange-100">
                  <Icon size={30} className="text-orange-700" />
                </div>

                <p className="leading-8 text-gray-600">{card.text}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-black px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            Contact Us
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;
