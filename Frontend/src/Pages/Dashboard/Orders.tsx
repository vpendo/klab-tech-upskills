
import { useMemo, useState } from "react";
import { Search, ShoppingBag, Clock, CheckCircle, Truck } from "lucide-react";
import OrderTable, {
  type Order as OrderType,
  type OrderStatus,
} from "../../Components/Dash/OrderTable";
import OrderDetails from "./OrderDetails";

const initialOrders: OrderType[] = [
  {
    id: "PH-1001",
    customer: "Alice Uwase",
    email: "alice@example.com",
    date: "2026-10-18",
    items: 2,
    total: 55000,
    status: "Pending",
  },
  {
    id: "PH-1002",
    customer: "David Mugisha",
    email: "david@example.com",
    date: "2026-10-17",
    items: 1,
    total: 30000,
    status: "Processing",
  },
  {
    id: "PH-1003",
    customer: "Sarah Mukamana",
    email: "sarah@example.com",
    date: "2026-10-16",
    items: 3,
    total: 85000,
    status: "Shipped",
  },
  {
    id: "PH-1004",
    customer: "Eric Niyonzima",
    email: "eric@example.com",
    date: "2026-10-15",
    items: 1,
    total: 25000,
    status: "Delivered",
  },
  {
    id: "PH-1005",
    customer: "Grace Ingabire",
    email: "grace@example.com",
    date: "2026-10-14",
    items: 2,
    total: 60000,
    status: "Cancelled",
  },
];

const statusOptions = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function Order() {
  const [orders, setOrders] = useState<OrderType[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    setSelectedOrder((currentOrder) =>
      currentOrder?.id === orderId
        ? { ...currentOrder, status }
        : currentOrder
    );
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;
  const shippedOrders = orders.filter(
    (order) => order.status === "Shipped"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Pending",
      value: pendingOrders,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Shipped",
      value: shippedOrders,
      icon: Truck,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Delivered",
      value: deliveredOrders,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
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

          <OrderTable
            orders={filteredOrders}
            onViewOrder={setSelectedOrder}
          />
        </section>
      </div>

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={updateOrderStatus}
        />
      )}
    </main>
  );
}
