
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  ShoppingBag,
  Heart,
  UserRound,
  ArrowRight,
  Package,
  Truck,
} from "lucide-react";

import CustomerSidebar from "../../Components/Dash/CustomerSidebar";
import DashboardCards from "../../Components/Dash/customercard";
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

  const { wishlistCount, refreshWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser || !localStorage.getItem("token")) {
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

      // Load the customer's wishlist from the backend.
      void refreshWishlist();
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate, refreshWishlist]);

  // Sample orders until real customer order data is available.
  const recentOrders = [
    {
      id: "PH-1005",
      product: "Classic White Sneakers",
      date: "18 Oct 2026",
      total: 25000,
      status: "Delivered",
    },
    {
      id: "PH-1004",
      product: "Casual Denim Jacket",
      date: "15 Oct 2026",
      total: 35000,
      status: "Processing",
    },
    {
      id: "PH-1003",
      product: "Women's Fashion Heels",
      date: "12 Oct 2026",
      total: 30000,
      status: "Pending",
    },
  ];

  const formatCurrency = (amount: number) =>
    `RWF ${amount.toLocaleString("en-US")}`;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const pendingOrders = recentOrders.filter(
    (order) =>
      order.status === "Pending" ||
      order.status === "Processing" ||
      order.status === "Shipped"
  ).length;

  const deliveredOrders = recentOrders.filter(
    (order) => order.status === "Delivered"
  ).length;

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
                  Your style, your way. Manage your orders, keep track of
                  deliveries, save your favorite items, and discover your next
                  look.
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

          {/* Customer statistics */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Your Overview
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                A quick look at your shopping activity.
              </p>
            </div>

            <DashboardCards
              totalOrders={recentOrders.length}
              pendingOrders={pendingOrders}
              deliveredOrders={deliveredOrders}
              wishlistItems={wishlistCount}
            />

            <p className="mt-2 text-xs text-gray-400">
              Order figures currently use sample data. Wishlist count is
              loaded from your saved products.
            </p>
          </section>

          {/* Recent orders */}
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Orders
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Check the status of your recent purchases.
                </p>
              </div>

              <Link
                to="/account/orders"
                className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Order</th>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-orange-50/40"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.product}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 p-4 text-center sm:hidden">
              <Link
                to="/account/orders"
                className="text-sm font-semibold text-orange-600"
              >
                View all orders
              </Link>
            </div>
          </section>

          {/* Quick actions */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Link
                to="/account/orders"
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Package size={23} />
                </div>
                <h3 className="font-bold text-gray-900">My Orders</h3>
                <p className="mt-2 text-sm leading-5 text-gray-500">
                  View purchases and check order progress.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  View orders <ArrowRight size={16} />
                </span>
              </Link>

              <Link
                to="/account/orders"
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Truck size={23} />
                </div>
                <h3 className="font-bold text-gray-900">Track Orders</h3>
                <p className="mt-2 text-sm leading-5 text-gray-500">
                  Follow your order from processing to delivery.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  Track order <ArrowRight size={16} />
                </span>
              </Link>

              <Link
                to="/wishlist"
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                  <Heart size={23} />
                </div>
                <h3 className="font-bold text-gray-900">
                  My Wishlist ({wishlistCount})
                </h3>
                <p className="mt-2 text-sm leading-5 text-gray-500">
                  Find the clothes and shoes you have saved.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  View wishlist <ArrowRight size={16} />
                </span>
              </Link>

              <Link
                to="/account/profile"
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <UserRound size={23} />
                </div>
                <h3 className="font-bold text-gray-900">My Profile</h3>
                <p className="mt-2 text-sm leading-5 text-gray-500">
                  Manage your personal and account information.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  Edit profile <ArrowRight size={16} />
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
