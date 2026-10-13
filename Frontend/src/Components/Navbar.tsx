import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    `relative whitespace-nowrap py-2 text-sm font-semibold transition-colors
    after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-orange-500
    after:transition-all after:duration-300 ${
      isActive
        ? "text-orange-500 after:w-full"
        : "text-gray-800 after:w-0 hover:text-orange-500 hover:after:w-full"
    }`;

  const categoryStyle =
    "block rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600";

  const mobileLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-orange-50 text-orange-600"
        : "text-gray-800 hover:bg-orange-50 hover:text-orange-600"
    }`;

  const categories = [
    { label: "All Shoes", url: "/shop?category=Shoes" },
    { label: "All Clothes", url: "/shop?category=Clothes" },
    { label: "Men's Shoes", url: "/shop?category=Shoes&gender=Men" },
    { label: "Men's Clothes", url: "/shop?category=Clothes&gender=Men" },
    { label: "Women's Shoes", url: "/shop?category=Shoes&gender=Women" },
    { label: "Women's Clothes", url: "/shop?category=Clothes&gender=Women" },
  ];

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setMobileCategoriesOpen(false);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("search") || "").trim();

    if (query) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      closeMobileMenu();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-5 md:min-h-[76px] md:px-6 lg:px-10">
        {/* Logo: always on the left */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="shrink-0 whitespace-nowrap text-xl font-black tracking-tight sm:text-2xl"
        >
          Pendo<span className="text-orange-500">Hub</span>
        </Link>

        {/* Desktop navigation: visible from large screens */}
        <div className="hidden items-center justify-center gap-5 lg:flex xl:gap-8">
          <NavLink to="/" end className={linkStyle}>
            New Arrivals
          </NavLink>

          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              aria-expanded={categoriesOpen}
              className={`flex items-center gap-1 py-2 text-sm font-semibold transition ${
                categoriesOpen
                  ? "text-orange-500"
                  : "text-gray-800 hover:text-orange-500"
              }`}
            >
              Categories
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  categoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {categoriesOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                {categories.map((category, index) => (
                  <div key={category.url}>
                    {index === 2 && (
                      <div className="my-1 border-t border-gray-100" />
                    )}
                    <Link
                      to={category.url}
                      onClick={() => setCategoriesOpen(false)}
                      className={categoryStyle}
                    >
                      {category.label}
                    </Link>
                  </div>
                ))}
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

        {/* Desktop icons: hidden on small and medium screens */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
            className="rounded-full p-2 text-gray-800 transition hover:bg-orange-50 hover:text-orange-500"
          >
            <Search size={21} />
          </button>

          <Link
            to="/login"
            aria-label="Login"
            className="rounded-full p-2 text-gray-800 transition hover:bg-orange-50 hover:text-orange-500"
          >
            <UserRound size={21} />
          </Link>

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="rounded-full p-2 text-gray-800 transition hover:bg-orange-50 hover:text-orange-500"
          >
            <Heart size={21} />
          </Link>

          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="rounded-full p-2 text-gray-800 transition hover:bg-orange-50 hover:text-orange-500"
          >
            <ShoppingBag size={21} />
          </Link>
        </div>

        {/* Small-device controls: search + menu only */}
        <div className="flex shrink-0 items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
            aria-expanded={searchOpen}
            className="rounded-full p-2 text-gray-800 transition hover:bg-orange-50 hover:text-orange-500"
          >
            <Search size={20} />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="rounded-full p-2 text-gray-800 transition hover:bg-orange-50 hover:text-orange-500"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Search panel */}
      {searchOpen && (
        <div className="w-full border-t border-gray-100 bg-white px-3 py-3 sm:px-5 sm:py-4">
          <form
            onSubmit={handleSearch}
            className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-full border border-gray-200 px-3 py-2.5 focus-within:border-orange-500 sm:gap-3 sm:px-5 sm:py-3"
          >
            <Search size={19} className="shrink-0 text-orange-500" />

            <input
              name="search"
              type="search"
              placeholder="Search clothes, shoes..."
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />

            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="shrink-0 text-xs font-semibold text-gray-500 hover:text-orange-500 sm:text-sm"
            >
              Close
            </button>
          </form>
        </div>
      )}

      {/* Small and medium device dropdown */}
      {menuOpen && (
        <div className="absolute left-0 top-full z-50 max-h-[calc(100dvh-64px)] w-full overflow-y-auto border-t border-gray-100 bg-white px-4 py-4 shadow-xl sm:px-6 lg:hidden">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={closeMobileMenu}
              className={mobileLinkStyle}
            >
              New Arrivals
            </NavLink>

            <button
              type="button"
              onClick={() =>
                setMobileCategoriesOpen(!mobileCategoriesOpen)
              }
              aria-expanded={mobileCategoriesOpen}
              className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-semibold text-gray-800 transition hover:bg-orange-50 hover:text-orange-600"
            >
              Categories
              <ChevronDown
                size={17}
                className={`transition-transform ${
                  mobileCategoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileCategoriesOpen && (
              <div className="ml-3 border-l-2 border-orange-200 pl-3">
                {categories.map((category, index) => (
                  <div key={category.url}>
                    {index === 2 && (
                      <div className="my-1 border-t border-gray-100" />
                    )}
                    <Link
                      to={category.url}
                      onClick={closeMobileMenu}
                      className="block rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                      {category.label}
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <NavLink
              to="/about"
              onClick={closeMobileMenu}
              className={mobileLinkStyle}
            >
              About Us
            </NavLink>

            <NavLink
              to="/contact"
              onClick={closeMobileMenu}
              className={mobileLinkStyle}
            >
              Contact Us
            </NavLink>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-lg border border-orange-200 px-2 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
              >
                <UserRound size={17} />
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-2 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Create Account
              </Link>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                to="/wishlist"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Heart size={17} />
                Wishlist
              </Link>

              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <ShoppingBag size={17} />
                Shopping Bag
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
