import { useCallback, useEffect, useState } from "react";
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
  RefreshCw,
} from "lucide-react";

import CustomerSidebar from "../../Components/Dash/CustomerSidebar";
import DashboardCards from "../../Components/Dash/customercard";
import OrderStatusBadge from "../../Components/Dash/OrderStatusBadge";
import type { OrderStatus } from "../../Components/Dash/OrderTable";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishlistContext";
import api from "../../services/api";

interface CustomerUser {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: "customer" | "admin";
}

interface CustomerOrder {
  _id: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CustomerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customerName, setCustomerName] = useState("Customer");
  const [authChecked, setAuthChecked] = useState(false);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  const { cartCount, refreshCart } = useCart();
  const { wishlistCount, refreshWishlist } = useWishlist();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersError("");

      const response = await api.get("/api/orders/my-orders");
      const data = response.data;

      const orderList = Array.isArray(data)
        ? data
        : Array.isArray(data.orders)
          ? data.orders
          : Array.isArray(data.data)
            ? data.data
            : [];

      setOrders(orderList);
    } catch (error) {
      console.error("Failed to fetch customer orders:", error);
      setOrdersError("Unable to load your orders. Please try again.");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

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
      setAuthChecked(true);

      void refreshCart();
      void refreshWishlist();
      void fetchOrders();
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate, refreshCart, refreshWishlist, fetchOrders]);

  // Refresh order statuses periodically while the dashboard is open.
  useEffect(() => {
    if (!authChecked) return;

    const intervalId = window.setInterval(() => {
      void fetchOrders();
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [authChecked, fetchOrders]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p className="mt-3 text-sm text-gray-600">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <CustomerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
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
              className="hidden items-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:inline-flex"
            >
              <ShoppingBag size={18} />
              Shop Products
            </Link>
          </header>

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

          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Your Overview
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Check your orders, shopping bag, and saved products.
              </p>
            </div>

            <DashboardCards
              totalOrders={orders.length}
              pendingOrders={pendingOrders}
              deliveredOrders={deliveredOrders}
              cartItems={cartCount}
              wishlistItems={wishlistCount}
            />
          </section>

          {/* Recent orders and current status */}
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Orders
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Check the latest status of your purchases.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void fetchOrders()}
                disabled={ordersLoading}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={ordersLoading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {ordersError ? (
                <div className="text-center">
                  <p className="text-sm text-red-600">{ordersError}</p>
                  <button
                    type="button"
                    onClick={() => void fetchOrders()}
                    className="mt-3 text-sm font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Try again
                  </button>
                </div>
              ) : ordersLoading ? (
                <p className="py-6 text-center text-sm text-gray-500">
                  Loading your orders...
                </p>
              ) : recentOrders.length === 0 ? (
                <div className="py-8 text-center">
                  <Package
                    size={36}
                    className="mx-auto text-gray-300"
                  />
                  <p className="mt-3 font-semibold text-gray-800">
                    No orders yet
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Your purchases will appear here after checkout.
                  </p>
                  <Link
                    to="/shop"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                  >
                    Start Shopping <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {formatCurrency(order.total)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <OrderStatusBadge status={order.status} />
                        <Link
                          to="/account/orders"
                          className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                        >
                          View <ArrowRight size={15} className="inline" />
                        </Link>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 text-center">
                    <Link
                      to="/account/orders"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
                    >
                      View all orders <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>

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

              <Link
                to="/account/orders"
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Package size={23} />
                </div>
                <h3 className="font-bold text-gray-900">My Orders</h3>
                <p className="mt-2 text-sm leading-5 text-gray-500">
                  View your purchases, totals, and current statuses.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  View orders <ArrowRight size={16} />
                </span>
              </Link>

              <Link
                to="/account/orders"
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Truck size={23} />
                </div>
                <h3 className="font-bold text-gray-900">Track Orders</h3>
                <p className="mt-2 text-sm leading-5 text-gray-500">
                  Check whether your orders are processing, shipped, or delivered.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  Track orders <ArrowRight size={16} />
                </span>
              </Link>

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
