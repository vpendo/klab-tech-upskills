import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";

const shopLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "Women", href: "/shop?gender=Women" },
  { label: "Men", href: "/shop?gender=Men" },
  { label: "Shoes", href: "/shop?category=Shoes" },
  { label: "Clothes", href: "/shop?category=Clothes" },
];

const careLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) return;

    // Frontend only: no newsletter subscription is stored or sent.
    setMessage("Thanks for your interest! Newsletter subscriptions are coming soon.");
    setEmail("");
  };

  return (
    <footer className="border-t border-gray-800 bg-black font-sans text-gray-300">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 sm:pt-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div>
            <Link
              to="/"
              aria-label="PendoHub home"
              className="inline-block text-2xl font-extrabold tracking-tight text-white transition hover:opacity-90"
            >
              Pendo<span className="text-orange-500">Hub.</span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              Discover your style with PendoHub. Shop fashionable clothes and
              shoes for men and women, all in one place.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-gray-400">
              <Mail size={17} className="shrink-0 text-orange-500" />

              <a
                href="mailto:pendohub@gmail.com"
                className="break-all transition-colors hover:text-orange-400"
              >
                pendohub@gmail.com
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <nav aria-label="Shop">
            <h3 className="text-base font-bold text-white">
              Shop<span className="ml-2 text-orange-500">.</span>
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="inline-block transition-colors duration-200 hover:translate-x-1 hover:text-orange-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Customer Care */}
          <nav aria-label="Customer care">
            <h3 className="text-base font-bold text-white">
              Customer Care
              <span className="ml-2 text-orange-500">.</span>
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              {careLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="inline-block transition-colors duration-200 hover:translate-x-1 hover:text-orange-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div>
            <h3 className="text-base font-bold text-white">
              Stay in Style
              <span className="ml-2 text-orange-500">.</span>
            </h3>

            <p className="mt-5 text-sm leading-6 text-gray-400">
              Get updates about new arrivals, fashion trends, and special offers.
            </p>

            <form onSubmit={handleSubmit} className="mt-5">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>

              <div className="flex overflow-hidden rounded-lg border border-gray-700 bg-gray-900 transition-colors focus-within:border-orange-500">
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setMessage("");
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-gray-500"
                />

                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="flex h-12 shrink-0 items-center justify-center bg-orange-500 px-4 text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                >
                  <ArrowRight size={20} />
                </button>
              </div>

              {message && (
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-3 text-sm leading-5 text-orange-400"
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} PendoHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
