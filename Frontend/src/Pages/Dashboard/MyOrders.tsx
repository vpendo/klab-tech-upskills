
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";
import CustomerSidebar from "../../Components/Dash/CustomerSidebar";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

interface OrderItem {
  id: string;
  product: string;
  date: string;
  total: number;
  status: OrderStatus;
}

const sampleOrders: OrderItem[] = [
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

const getStatusStyle = (status: OrderStatus) => {
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

export default function MyOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const orders = sampleOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <CustomerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page header */}
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg border border-gray-200 bg-white p-2 text-gray-700 lg:hidden"
                aria-label="Open dashboard menu"
              >
                <Package size={21} />
              </button>

              <div>
                <p className="text-sm text-gray-500">My Account</p>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  My Orders
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  View your purchases and track their progress.
                </p>
              </div>
            </div>

            <Link
              to="/shop"
              className="hidden items-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:inline-flex"
            >
              <ShoppingBag size={18} />
              Shop Now
            </Link>
          </header>

          {/* Order summary */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Total Orders</p>
                <ShoppingBag className="text-orange-500" size={22} />
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">
                {sampleOrders.length}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">In Progress</p>
                <Truck className="text-blue-500" size={22} />
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">
                {
                  sampleOrders.filter(
                    (order) =>
                      order.status === "Pending" ||
                      order.status === "Processing" ||
                      order.status === "Shipped"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Delivered</p>
                <Package className="text-green-500" size={22} />
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">
                {
                  sampleOrders.filter(
                    (order) => order.status === "Delivered"
                  ).length
                }
              </p>
            </div>
          </section>

          {/* Search and filter */}
          <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by order number or product..."
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
                aria-label="Filter orders by status"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </section>

          {/* Orders table */}
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Order History
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {orders.length} {orders.length === 1 ? "order" : "orders"} found
              </p>
            </div>

            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Order ID</th>
                      <th className="px-6 py-4 font-semibold">Product</th>
                      <th className="px-6 py-4 font-semibold">Order Date</th>
                      <th className="px-6 py-4 font-semibold">Total</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition hover:bg-orange-50/40"
                      >
                        <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-700">
                          {order.product}
                        </td>
                        <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">
                          {order.date}
                        </td>
                        <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-gray-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-5">
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
            ) : (
              <div className="px-6 py-14 text-center">
                <Package
                  size={38}
                  className="mx-auto text-gray-300"
                />
                <h3 className="mt-4 font-semibold text-gray-900">
                  No orders found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try another search or choose a different status.
                </p>
              </div>
            )}
          </section>

          {/* Bottom actions */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <Link
              to="/account"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-orange-600"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Continue Shopping
              <ArrowRight size={17} />
            </Link>
          </div>

          <p className="text-xs text-gray-400">
            These are sample orders for the frontend demonstration. Real order
            history and tracking require customer-specific order data.
          </p>
        </div>
      </main>
    </div>
  );
}
