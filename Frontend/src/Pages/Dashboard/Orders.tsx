import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  LoaderCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import api from "../../services/api";
import OrderTable, {
  type Order as OrderType,
  type OrderStatus,
} from "../../Components/Dash/OrderTable";
import OrderDetails from "./OrderDetails";

const statusOptions = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function Order() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/orders");
      const data = response.data;

      const fetchedOrders: OrderType[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.orders)
          ? data.orders
          : [];

      setOrders(fetchedOrders);
    } catch (err: unknown) {
      console.error("Failed to fetch orders:", err);
      setError("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        (order._id ?? "").toLowerCase().includes(query) ||
        (order.customerName ?? "").toLowerCase().includes(query) ||
        (order.email ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus
  ): Promise<void> => {
    setUpdatingStatus(true);
    setError("");

    try {
      const response = await api.patch(
        `/orders/${orderId}/status`,
        { status }
      );

      const updatedOrder: OrderType | undefined =
        response.data?.order?._id
          ? response.data.order
          : response.data?._id
            ? response.data
            : undefined;

      const savedStatus = updatedOrder?.status ?? status;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: savedStatus }
            : order
        )
      );

      setSelectedOrder((currentOrder) =>
        currentOrder?._id === orderId
          ? { ...currentOrder, status: savedStatus }
          : currentOrder
      );
    } catch (err: unknown) {
      console.error("Failed to update order status:", err);
      setError("Unable to update order status. Please try again.");
      throw err;
    } finally {
      setUpdatingStatus(false);
    }
  };

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Pending",
      value: orders.filter((order) => order.status === "Pending").length,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Shipped",
      value: orders.filter((order) => order.status === "Shipped").length,
      icon: Truck,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Delivered",
      value: orders.filter((order) => order.status === "Delivered").length,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard/admin")}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-orange-500 hover:text-orange-600"
          >
            <ArrowLeft size={18} />
            Back to Admin Dashboard
          </button>

          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
            PendoHub Administration
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View customer orders and manage their status.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>

                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-extrabold text-gray-900">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                All Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredOrders.length} orders found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search orders..."
                  aria-label="Search orders"
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500 sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter orders by status"
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All statuses" : status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="m-5 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle size={18} />
              <span>{error}</span>

              <button
                type="button"
                onClick={() => void fetchOrders()}
                className="ml-auto font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
              <LoaderCircle size={22} className="animate-spin" />
              <span>Loading orders...</span>
            </div>
          ) : (
            <OrderTable
              orders={filteredOrders}
              onViewOrder={setSelectedOrder}
            />
          )}
        </section>
      </div>

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={updateOrderStatus}
          updatingStatus={updatingStatus}
        />
      )}
    </main>
  );
}
