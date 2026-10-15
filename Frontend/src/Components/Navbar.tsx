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
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    { label: "Shop All", url: "/shop" },
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

  const closeNavigation = () => {
    closeMobileMenu();
    setCategoriesOpen(false);
    setSearchOpen(false);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchQuery.trim();

    closeNavigation();
    setSearchQuery("");

    if (query) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    }
  };

  const toggleSearch = () => {
    setSearchOpen((previous) => !previous);
    setCategoriesOpen(false);
    setMenuOpen(false);
    setMobileCategoriesOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-5 md:min-h-[76px] md:px-6 lg:px-10">
        <Link
          to="/"
          onClick={closeNavigation}
          className="shrink-0 whitespace-nowrap text-xl font-black tracking-tight sm:text-2xl"
        >
          Pendo<span className="text-orange-500">Hub</span>
        </Link>

        <div className="hidden items-center justify-center gap-5 lg:flex xl:gap-8">
          <NavLink to="/" end className={linkStyle}>
            New Arrivals
          </NavLink>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setCategoriesOpen((previous) => !previous);
                setSearchOpen(false);
              }}
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
              <>
                <button
                  type="button"
                  aria-label="Close categories menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setCategoriesOpen(false)}
                />

                <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                  {categories.map((category, index) => (
                    <div key={category.label}>
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
              </>
            )}
          </div>

          <NavLink to="/about" className={linkStyle}>
            About Us
          </NavLink>

          <NavLink to="/contact" className={linkStyle}>
            Contact Us
          </NavLink>
        </div>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={toggleSearch}
            aria-label="Toggle search"
            aria-expanded={searchOpen}
            className="rounded-full p-2 text-gray-800 transition hover:bg-orange-50 hover:text-orange-500"
          >
            <Search size={21} />
          </button>

          <Link
            to="/login"
            aria-label="Login"
            onClick={closeNavigation}
            className="rounded-full p-2 text-gray-800 transition hover:bg-orange-50 hover:text-orange-500"
          >
            <UserRound size={21} />
          </Link>

          <Link
            to="/wishlist"
            aria-label={`Wishlist with ${wishlistCount} saved products`}
            onClick={closeNavigation}
            className="relative rounded-full p-2 text-gray-800 transition hover:bg-orange-50 hover:text-orange-500"
          >
            <Heart
              size={21}
              className={
                wishlistCount > 0
                  ? "fill-orange-500 text-orange-500"
                  : ""
              }
            />

            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label={`Shopping cart with ${cartCount} items`}
            onClick={closeNavigation}
            className="relative rounded-full p-2 text-gray-800 transition hover:bg-orange-50 hover:text-orange-500"
          >
            <ShoppingBag size={21} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={toggleSearch}
            aria-label="Toggle search"
            aria-expanded={searchOpen}
            className="rounded-full p-2 text-gray-800 transition hover:bg-orange-50 hover:text-orange-500"
          >
            <Search size={20} />
          </button>

          <button
            type="button"
            onClick={() => {
              setMenuOpen((previous) => !previous);
              setCategoriesOpen(false);
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="rounded-full p-2 text-gray-800 transition hover:bg-orange-50 hover:text-orange-500"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {searchOpen && (
        <div className="border-t border-gray-100 bg-white px-3 py-3 sm:px-5 sm:py-4">
          <form
            onSubmit={handleSearch}
            className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-full border border-gray-200 px-3 py-2.5 focus-within:border-orange-500 sm:gap-3 sm:px-5 sm:py-3"
          >
            <Search size={19} className="shrink-0 text-orange-500" />

            <input
              name="search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search clothes, shoes..."
              aria-label="Search products"
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />

            <button
              type="submit"
              className="shrink-0 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 sm:text-sm"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              aria-label="Close search"
              className="shrink-0 rounded-full p-1 text-gray-500 transition hover:bg-orange-50 hover:text-orange-500"
            >
              <X size={19} />
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="absolute left-0 top-full z-50 max-h-[calc(100dvh-64px)] w-full overflow-y-auto border-t border-gray-100 bg-white px-4 py-4 shadow-xl sm:px-6 lg:hidden">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={closeNavigation}
              className={mobileLinkStyle}
            >
              New Arrivals
            </NavLink>

            <button
              type="button"
              onClick={() =>
                setMobileCategoriesOpen((previous) => !previous)
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
                  <div key={category.label}>
                    {index === 2 && (
                      <div className="my-1 border-t border-gray-100" />
                    )}

                    <Link
                      to={category.url}
                      onClick={closeNavigation}
                      className={categoryStyle}
                    >
                      {category.label}
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <NavLink
              to="/about"
              onClick={closeNavigation}
              className={mobileLinkStyle}
            >
              About Us
            </NavLink>

            <NavLink
              to="/contact"
              onClick={closeNavigation}
              className={mobileLinkStyle}
            >
              Contact Us
            </NavLink>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
              <Link
                to="/login"
                onClick={closeNavigation}
                className="flex items-center justify-center gap-2 rounded-lg border border-orange-200 px-2 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
              >
                <UserRound size={17} />
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeNavigation}
                className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-2 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                <UserRound size={17} />
                Create Account
              </Link>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                to="/wishlist"
                onClick={closeNavigation}
                className="flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Heart
                  size={17}
                  className={
                    wishlistCount > 0
                      ? "fill-orange-500 text-orange-500"
                      : ""
                  }
                />
                Wishlist ({wishlistCount})
              </Link>

              <Link
                to="/cart"
                onClick={closeNavigation}
                className="flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <ShoppingBag size={17} />
                Shopping Bag ({cartCount})
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;