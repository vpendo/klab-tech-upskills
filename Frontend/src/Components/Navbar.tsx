
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    `relative whitespace-nowrap py-2 text-sm font-semibold transition-colors duration-300
    after:absolute after:bottom-0 after:left-0 after:h-0.5
    after:bg-orange-500 after:transition-all after:duration-300
    ${
      isActive
        ? "text-orange-500 after:w-full"
        : "text-gray-800 after:w-0 hover:text-orange-500 hover:after:w-full"
    }`;

  const categoryStyle =
    "block rounded-md px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-500";

  const mobileCategoryStyle =
    "block w-full rounded-md px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-500";

  const closeMobileMenu = () => {
    setMobileCategoriesOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      {/* Main Navbar */}
      <nav className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 lg:px-10">
        {/* Logo - Left */}
        <Link
          to="/"
          className="shrink-0 whitespace-nowrap text-2xl font-black tracking-tight"
        >
          Pendo<span className="text-orange-500">Hub</span>
        </Link>

        {/* Navigation Links - Center */}
        <div className="hidden items-center justify-center gap-5 whitespace-nowrap md:flex lg:gap-8">
          <NavLink to="/" end className={linkStyle}>
            New Arrivals
          </NavLink>

          {/* Desktop Categories Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              aria-expanded={categoriesOpen}
              className={`flex items-center gap-1 py-2 text-sm font-semibold transition-colors duration-300 ${
                categoriesOpen
                  ? "text-orange-500"
                  : "text-gray-800 hover:text-orange-500"
              }`}
            >
              Categories

              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  categoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {categoriesOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-52 rounded-lg border border-gray-100 bg-white p-2 shadow-lg">
                <Link
                  to="/shop?category=Shoes"
                  onClick={() => setCategoriesOpen(false)}
                  className={categoryStyle}
                >
                  All Shoes
                </Link>

                <Link
                  to="/shop?category=Clothes"
                  onClick={() => setCategoriesOpen(false)}
                  className={categoryStyle}
                >
                  All Clothes
                </Link>

                <div className="my-1 border-t border-gray-100" />

                <Link
                  to="/shop?category=Shoes&gender=Men"
                  onClick={() => setCategoriesOpen(false)}
                  className={categoryStyle}
                >
                  Men's Shoes
                </Link>

                <Link
                  to="/shop?category=Clothes&gender=Men"
                  onClick={() => setCategoriesOpen(false)}
                  className={categoryStyle}
                >
                  Men's Clothes
                </Link>

                <Link
                  to="/shop?category=Shoes&gender=Women"
                  onClick={() => setCategoriesOpen(false)}
                  className={categoryStyle}
                >
                  Women's Shoes
                </Link>

                <Link
                  to="/shop?category=Clothes&gender=Women"
                  onClick={() => setCategoriesOpen(false)}
                  className={categoryStyle}
                >
                  Women's Clothes
                </Link>
              </div>
            )}
          </div>

          <NavLink to="/about" className={linkStyle}>
            About Us
          </NavLink>

          <NavLink to="/contact" className={linkStyle}>
            Contact Us
          </NavLink>
        </div>

        {/* Icons - Right */}
        <div className="flex items-center justify-self-end gap-1 sm:gap-3">
          {/* Search */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
            className="rounded-full p-2 text-gray-800 transition duration-300 hover:bg-orange-50 hover:text-orange-500"
          >
            <Search size={21} strokeWidth={1.8} />
          </button>

          {/* Login */}
          <Link
            to="/login"
            aria-label="Login"
            className="rounded-full p-2 text-gray-800 transition duration-300 hover:bg-orange-50 hover:text-orange-500"
          >
            <UserRound size={21} strokeWidth={1.8} />
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="rounded-full p-2 text-gray-800 transition duration-300 hover:bg-orange-50 hover:text-orange-500"
          >
            <Heart size={21} strokeWidth={1.8} />
          </Link>

          {/* Shopping Bag */}
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="rounded-full p-2 text-gray-800 transition duration-300 hover:bg-orange-50 hover:text-orange-500"
          >
            <ShoppingBag size={21} strokeWidth={1.8} />
          </Link>

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="rounded-full p-2 text-gray-800 transition hover:bg-orange-50 hover:text-orange-500 md:hidden"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </nav>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();

              const data = new FormData(event.currentTarget);
              const query = String(data.get("search") || "").trim();

              if (query) {
                window.location.href = `/shop?search=${encodeURIComponent(query)}`;
              }
            }}
            className="mx-auto flex max-w-2xl items-center gap-3 rounded-full border border-gray-200 px-5 py-3 transition focus-within:border-orange-500"
          >
            <Search size={20} className="shrink-0 text-orange-500" />

            <input
              name="search"
              type="search"
              placeholder="Search clothes, shoes..."
              autoFocus
              className="w-full bg-transparent text-sm outline-none"
            />

            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-sm font-semibold text-gray-500 transition hover:text-orange-500"
            >
              Close
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-orange-50 text-orange-500"
                    : "text-gray-800 hover:bg-orange-50 hover:text-orange-500"
                }`
              }
            >
              New Arrivals
            </NavLink>

            {/* Mobile Categories Dropdown */}
            <button
              type="button"
              onClick={() =>
                setMobileCategoriesOpen(!mobileCategoriesOpen)
              }
              aria-expanded={mobileCategoriesOpen}
              className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-orange-50 hover:text-orange-500"
            >
              Categories

              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  mobileCategoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileCategoriesOpen && (
              <div className="ml-4 border-l-2 border-orange-200 pl-3">
                <Link
                  to="/shop?category=Shoes"
                  onClick={closeMobileMenu}
                  className={mobileCategoryStyle}
                >
                  All Shoes
                </Link>

                <Link
                  to="/shop?category=Clothes"
                  onClick={closeMobileMenu}
                  className={mobileCategoryStyle}
                >
                  All Clothes
                </Link>

                <div className="my-1 border-t border-gray-100" />

                <Link
                  to="/shop?category=Shoes&gender=Men"
                  onClick={closeMobileMenu}
                  className={mobileCategoryStyle}
                >
                  Men's Shoes
                </Link>

                <Link
                  to="/shop?category=Clothes&gender=Men"
                  onClick={closeMobileMenu}
                  className={mobileCategoryStyle}
                >
                  Men's Clothes
                </Link>

                <Link
                  to="/shop?category=Shoes&gender=Women"
                  onClick={closeMobileMenu}
                  className={mobileCategoryStyle}
                >
                  Women's Shoes
                </Link>

                <Link
                  to="/shop?category=Clothes&gender=Women"
                  onClick={closeMobileMenu}
                  className={mobileCategoryStyle}
                >
                  Women's Clothes
                </Link>
              </div>
            )}

            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={linkStyle}
            >
              About Us
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={linkStyle}
            >
              Contact Us
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
