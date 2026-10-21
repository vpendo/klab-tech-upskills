import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  ShoppingBag,
  ShoppingCart,
  Heart,
  UserRound,
  ArrowRight,
  Package,
  Truck,
} from "lucide-react";

import CustomerSidebar from "../../Components/Dash/CustomerSidebar";
import DashboardCards from "../../Components/Dash/customercard";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishlistContext";

interface CustomerUser {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: "customer" | "admin";
}

export default function CustomerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customerName, setCustomerName] = useState("Customer");

  const { cartCount, refreshCart } = useCart();
  const { wishlistCount, refreshWishlist } = useWishlist();

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!savedUser || !token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user: CustomerUser = JSON.parse(savedUser);

      if (user.role !== "customer") {
        navigate(
          user.role === "admin" ? "/dashboard/admin" : "/login",
          { replace: true }
        );
        return;
      }

      setCustomerName(user.name?.trim() || "Customer");

      void refreshCart();
      void refreshWishlist();
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate, refreshCart, refreshWishlist]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <CustomerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg border border-gray-200 bg-white p-2 text-gray-700 lg:hidden"
                aria-label="Open dashboard menu"
              >
                <Menu size={22} />
              </button>

              <div>
                <p className="text-sm text-gray-500">My Account</p>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Customer Dashboard
                </h1>
              </div>
            </div>

            <Link
              to="/shop"
              className="hidden items-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:flex"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>
          </header>

          {/* Welcome banner */}
          <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="mb-2 text-sm font-medium text-orange-100">
                  WELCOME TO PENDOHUB
                </p>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Welcome, {customerName}!
                </h2>

                <p className="mt-2 max-w-lg text-sm leading-6 text-orange-50 sm:text-base">
                  Your style, your way. Manage your shopping bag, keep your
                  favorite products close, and discover your next look.
                </p>

                <Link
                  to="/shop"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-orange-600 transition hover:bg-orange-50"
                >
                  Explore the Shop <ArrowRight size={18} />
                </Link>
              </div>

              <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/15 sm:flex">
                <ShoppingBag size={44} />
              </div>
            </div>
          </section>

          {/* Shopping overview */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Your Overview
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Access your shopping bag and saved products.
              </p>
            </div>

            <DashboardCards
              cartItems={cartCount}
              wishlistItems={wishlistCount}
            />
          </section>

          {/* Quick actions */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account and shopping activity.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {/* My Cart */}
              <Link
                to="/account/cart"
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <ShoppingCart size={23} />
                </div>

                <h3 className="font-bold text-gray-900">
                  My Cart ({cartCount})
                </h3>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  Review your selected clothes and shoes before checkout.
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  View cart <ArrowRight size={16} />
                </span>
              </Link>

              {/* My Wishlist */}
              <Link
                to="/account/wishlist"
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                  <Heart size={23} />
                </div>

                <h3 className="font-bold text-gray-900">
                  My Wishlist ({wishlistCount})
                </h3>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  Find and manage the clothes and shoes you have saved.
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  View wishlist <ArrowRight size={16} />
                </span>
              </Link>

              {/* My Orders */}
              <Link
                to="/account/orders"
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Package size={23} />
                </div>

                <h3 className="font-bold text-gray-900">My Orders</h3>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  View your purchases and check order progress.
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  View orders <ArrowRight size={16} />
                </span>
              </Link>

              {/* Track Orders */}
              <Link
                to="/account/orders"
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Truck size={23} />
                </div>

                <h3 className="font-bold text-gray-900">Track Orders</h3>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  Check the status of your orders and deliveries.
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  Track orders <ArrowRight size={16} />
                </span>
              </Link>

              {/* My Profile */}
              <Link
                to="/account/profile"
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <UserRound size={23} />
                </div>

                <h3 className="font-bold text-gray-900">My Profile</h3>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  Manage your personal and account information.
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  View profile <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </section>

          {/* Shopping reminder */}
          <section className="flex flex-col justify-between gap-4 rounded-2xl border border-orange-100 bg-orange-50 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h2 className="font-bold text-gray-900">
                Ready for your next look?
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Explore the latest shoes and clothing at PendoHub.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Shop Now <ArrowRight size={17} />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
