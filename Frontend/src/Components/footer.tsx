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
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "FAQs", href: "/faq" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) return;

    // TODO: Connect this form to your newsletter API.
    setJoined(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-gray-800 bg-black font-sans text-gray-300">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-14 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-block text-2xl font-extrabold tracking-wide text-white"
            >
              Pendo<span className="text-orange-500">Hub</span>
              <span className="text-orange-500">.</span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              Discover your style with PendoHub. Shop fashionable clothes and
              shoes for men and women, all in one place.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-gray-400">
              <Mail size={17} className="text-orange-500" />
              <a
                href="mailto:pendohub@gmail.com"
                className="transition-colors hover:text-orange-400"
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
                    className="transition-colors duration-200 hover:text-orange-400"
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
                    className="transition-colors duration-200 hover:text-orange-400"
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
              Subscribe for fashion updates, new arrivals, and special offers.
            </p>

            <form onSubmit={handleSubmit} className="mt-5">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>

              <div className="flex border border-gray-700 bg-gray-900 transition-colors focus-within:border-orange-500">
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setJoined(false);
                  }}
                  placeholder="Enter your email"
                  className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-gray-500"
                />

                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="flex h-12 items-center justify-center bg-orange-600 px-4 text-white transition-colors hover:bg-orange-700"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>

            {joined && (
              <p role="status" className="mt-3 text-sm text-orange-400">
                Thanks for your interest in PendoHub!
              </p>
            )}
          </div>
        </div>

        {/* Centered Copyright */}
        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} PendoHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}