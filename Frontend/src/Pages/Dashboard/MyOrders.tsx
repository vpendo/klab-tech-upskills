
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Search,
  ShoppingBag,
  Truck,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface OrderItem {
  productId?: string;
  name?: string;
  price?: number;
  quantity: number;
  imageUrl?: string;
  product?: {
    name?: string;
  };
}

interface BackendOrder {
  _id: string;
  createdAt?: string;
  items?: OrderItem[];
  total?: number;
  status: OrderStatus;
}

interface OrderRow {
  id: string;
  products: string;
  date: string;
  total: number;
  status: OrderStatus;
}

const validStatuses: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const formatCurrency = (amount: number) =>
  `RWF ${amount.toLocaleString("en-RW")}`;

const formatDate = (date?: string) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Processing":
      return "bg-blue-100 text-blue-700";
    case "Shipped":
      return "bg-purple-100 text-purple-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
};

export default function MyOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/orders/my-orders");
      const data = response.data;

      const orderList: BackendOrder[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.orders)
          ? data.orders
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.data?.orders)
              ? data.data.orders
              : [];

      if (
        !Array.isArray(data) &&
        !Array.isArray(data?.orders) &&
        !Array.isArray(data?.data) &&
        !Array.isArray(data?.data?.orders)
      ) {
        console.error("Unexpected orders response:", data);
      }

      const customerOrders: OrderRow[] = orderList.map((order) => {
        const productNames = (order.items ?? [])
          .map((item) => item.name || item.product?.name)
          .filter((name): name is string => Boolean(name));

        const status = validStatuses.includes(order.status)
          ? order.status
          : "Pending";

        return {
          id: order._id,
          products:
            productNames.join(", ") || "Product information unavailable",
          date: formatDate(order.createdAt),
          total: Number(order.total ?? 0),
          status,
        };
      });

      setOrders(customerOrders);
    } catch (err) {
      console.error("Failed to load customer orders:", err);

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const response = (
          err as { response?: { status?: number } }
        ).response;

        if (response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        if (response?.status === 403) {
          navigate("/dashboard/admin", { replace: true });
          return;
        }
      }

      setError(
        "Unable to load your orders. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      if (user.role !== "customer") {
        navigate(
          user.role === "admin" ? "/dashboard/admin" : "/login",
          { replace: true }
        );
        return;
      }

      void loadOrders();
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate, loadOrders]);

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(term) ||
      order.products.toLowerCase().includes(term);

    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const inProgressCount = orders.filter((order) =>
    ["Pending", "Processing", "Shipped"].includes(order.status)
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  return (
    <div className="min-w-0 bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page heading */}
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">My Account</p>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Orders
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View your purchases and track their progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadOrders()}
            disabled={loading}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60 sm:px-4 sm:py-3"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        {/* Order statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Orders</p>
              <ShoppingBag className="text-orange-500" size={22} />
            </div>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {loading ? "..." : orders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">In Progress</p>
              <Truck className="text-blue-500" size={22} />
            </div>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {loading ? "..." : inProgressCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Delivered</p>
              <Package className="text-green-500" size={22} />
            </div>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {loading ? "..." : deliveredCount}
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
                placeholder="Search by order ID or product..."
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

              {validStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Order history */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Order History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {loading
                ? "Loading your orders..."
                : `${filteredOrders.length} ${
                    filteredOrders.length === 1 ? "order" : "orders"
                  } found`}
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-14 text-center text-sm text-gray-500">
              Loading your orders...
            </div>
          ) : error ? (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => void loadOrders()}
                className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Products</th>
                    <th className="px-6 py-4 font-semibold">Order Date</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition hover:bg-orange-50/40"
                    >
                      <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-gray-900">
                        {order.id}
                      </td>

                      <td className="max-w-xs px-6 py-5 text-sm text-gray-700">
                        {order.products}
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
              <Package size={38} className="mx-auto text-gray-300" />

              <h3 className="mt-4 font-semibold text-gray-900">
                {orders.length === 0 ? "No orders yet" : "No orders found"}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {orders.length === 0
                  ? "Your purchases will appear here after you place an order."
                  : "Try another search or choose a different status."}
              </p>

              {orders.length === 0 && (
                <Link
                  to="/shop"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  <ShoppingBag size={18} />
                  Start Shopping
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
