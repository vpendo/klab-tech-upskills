import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  AlertTriangle,
  Shirt,
  Eye,
  Boxes,
  Settings,
} from "lucide-react";

import { products as initialProducts } from "../../data/product";
import type { Product } from "../../Types/product";

import AdminSidebar from "../../Components/Dash/AdminSidebar";
import AdminHeader from "../../Components/Dash/AdminHeader";
import AdminStatCard from "../../Components/Dash/AdminStatCard";

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface DemoOrder {
  id: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
}

interface LoggedInUser {
  name?: string;
  email?: string;
  role?: "customer" | "admin";
}

const demoOrders: DemoOrder[] = [
  {
    id: "PH-1005",
    customer: "Alice Uwase",
    date: "19 Oct 2026",
    items: 2,
    total: 55000,
    status: "Pending",
  },
  {
    id: "PH-1004",
    customer: "Eric Niyonzima",
    date: "18 Oct 2026",
    items: 1,
    total: 30000,
    status: "Processing",
  },
  {
    id: "PH-1003",
    customer: "Diane Mukamana",
    date: "17 Oct 2026",
    items: 3,
    total: 85000,
    status: "Delivered",
  },
  {
    id: "PH-1002",
    customer: "Kevin Ishimwe",
    date: "16 Oct 2026",
    items: 1,
    total: 25000,
    status: "Shipped",
  },
  {
    id: "PH-1001",
    customer: "Grace Uwera",
    date: "15 Oct 2026",
    items: 2,
    total: 60000,
    status: "Cancelled",
  },
];

const PRODUCTS_STORAGE_KEY = "pendohub-products";
const PRODUCTS_UPDATED_EVENT = "pendohub-products-updated";

const formatPrice = (price: number) =>
  `${price.toLocaleString("en-RW")} RWF`;

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

function getStoredProducts(): Product[] {
  try {
    const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);

    if (savedProducts !== null) {
      const parsedProducts: unknown = JSON.parse(savedProducts);

      if (Array.isArray(parsedProducts)) {
        return parsedProducts as Product[];
      }
    }
  } catch {
    console.error("Unable to load saved PendoHub products.");
  }

  return initialProducts;
}

export default function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser || !localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user: LoggedInUser = JSON.parse(savedUser);

      if (user.role !== "admin") {
        navigate(
          user.role === "customer" ? "/account" : "/login",
          { replace: true }
        );
        return;
      }

      setAdminName(user.name?.trim() || "Admin");
      setAdminEmail(user.email?.trim() || "");
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const refreshProducts = () => {
      setProducts(getStoredProducts());
    };

    window.addEventListener(PRODUCTS_UPDATED_EVENT, refreshProducts);
    window.addEventListener("storage", refreshProducts);

    return () => {
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, refreshProducts);
      window.removeEventListener("storage", refreshProducts);
    };
  }, []);

  const lowStockProducts = products.filter(
    (product) => product.quantity <= 5
  );

  const totalStock = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const activeOrders = demoOrders.filter(
    (order) =>
      order.status !== "Delivered" &&
      order.status !== "Cancelled"
  );

  const pendingOrders = demoOrders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrderValue = demoOrders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => sum + order.total, 0);

  const stats = [
    {
      title: "Total Products",
      value: products.length.toLocaleString("en-RW"),
      description: "Products in your catalog",
      icon: Package,
      iconClassName: "bg-orange-100 text-orange-600",
    },
    {
      title: "Total Stock",
      value: totalStock.toLocaleString("en-RW"),
      description: "Items available across products",
      icon: Boxes,
      iconClassName: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Orders",
      value: demoOrders.length.toLocaleString("en-RW"),
      description: `${activeOrders.length} active sample orders`,
      icon: ShoppingBag,
      iconClassName: "bg-blue-100 text-blue-600",
    },
    {
      title: "Delivered Order Value",
      value: formatPrice(deliveredOrderValue),
      description: "Value of delivered sample orders",
      icon: TrendingUp,
      iconClassName: "bg-green-100 text-green-600",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toLocaleString("en-RW"),
      description: "Orders awaiting review",
      icon: Clock,
      iconClassName: "bg-amber-100 text-amber-600",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] text-gray-900 lg:flex">
      <AdminSidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={handleLogout}
        pendingOrders={pendingOrders}
      />

      <div className="min-w-0 flex-1">
        <AdminHeader
          title="Admin Dashboard"
          subtitle="Manage your fashion store in one place."
          adminName={adminName}
          adminEmail={adminEmail || "Administrator"}
          onMenuClick={() => setMenuOpen(true)}
          onLogout={handleLogout}
        />

        <main className="mx-auto max-w-[1600px] space-y-8 p-4 sm:p-6 lg:p-8">
          <section className="flex flex-col justify-between gap-5 rounded-2xl bg-[#201b18] p-6 text-white sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="mb-2 text-sm font-semibold tracking-wide text-orange-300">
                YOUR STORE AT A GLANCE
              </p>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Welcome back, {adminName}!
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-gray-300">
                Manage your products, review customer orders, and
                keep PendoHub looking its best.
              </p>
            </div>

            <Link
              to="/dashboard/products"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              <Plus size={18} />
              Add New Product
            </Link>
          </section>

          <section>
            <div className="mb-5">
              <h2 className="text-lg font-bold">Store Overview</h2>
              <p className="mt-1 text-sm text-gray-500">
                A summary of your store's current activity.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
              {stats.map((stat) => (
                <AdminStatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  description={stat.description}
                  icon={stat.icon}
                  iconClassName={stat.iconClassName}
                />
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white xl:col-span-2">
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5">
                <div>
                  <h2 className="font-bold">Recent Orders</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Sample orders for dashboard layout.
                  </p>
                </div>

                <Link
                  to="/dashboard/orders"
                  className="flex shrink-0 items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  View all <ArrowRight size={16} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Order</th>
                      <th className="px-5 py-4 font-semibold">Customer</th>
                      <th className="px-5 py-4 font-semibold">Total</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Details</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {demoOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-5 py-4 font-semibold">
                          {order.id}
                          <p className="mt-1 text-xs font-normal text-gray-500">
                            {order.date}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                          {order.customer}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-medium">
                          {formatPrice(order.total)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <Link
                            to={`/dashboard/orders/${order.id}`}
                            aria-label={`View order ${order.id}`}
                            className="inline-flex rounded-lg p-2 text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                          >
                            <ArrowRight size={18} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white">
              <div className="flex items-center gap-3 border-b border-gray-100 p-5">
                <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
                  <AlertTriangle size={21} />
                </div>

                <div>
                  <h2 className="font-bold">Low Stock Alert</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Products with 5 or fewer items.
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                          <Shirt size={20} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                        {product.quantity} left
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center">
                    <Boxes size={30} className="mx-auto text-green-600" />
                    <p className="mt-3 text-sm font-semibold">
                      Stock looks good!
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      No products have 5 or fewer items.
                    </p>
                  </div>
                )}

                <Link
                  to="/dashboard/products"
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                >
                  Manage Products <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold">Quick Actions</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                to="/dashboard/products"
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-sm"
              >
                <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                  <Plus size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Manage Products</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Add, edit, and delete products.
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-gray-400 group-hover:text-orange-600"
                />
              </Link>

              <Link
                to="/dashboard/orders"
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-sm"
              >
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <ShoppingBag size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Manage Orders</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Review and update order statuses.
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-gray-400 group-hover:text-orange-600"
                />
              </Link>

              <Link
                to="/shop"
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-sm"
              >
                <div className="rounded-xl bg-green-100 p-3 text-green-600">
                  <Eye size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">View Store</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Browse the customer-facing store.
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-gray-400 group-hover:text-orange-600"
                />
              </Link>

              <Link
                to="/dashboard/settings"
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-sm"
              >
                <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                  <Settings size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Store Settings</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Manage store details and preferences.
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-gray-400 group-hover:text-orange-600"
                />
              </Link>
            </div>
          </section>

          <footer className="border-t border-gray-200 py-5 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} PendoHub. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}