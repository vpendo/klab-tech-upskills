import { useCallback, useEffect, useState } from "react";
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
  RefreshCw,
} from "lucide-react";

import {
  getProducts,
  getProductStats,
  type ProductStats,
} from "../../services/productService";
import type { Product } from "../../Types/product";

import AdminHeader from "../../Components/Dash/AdminHeader";
import AdminStatCard from "../../Components/Dash/AdminStatCard";
import api from "../../services/api";

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface DashboardOrder {
  _id: string;
  total: number;
  status: OrderStatus;
}

interface LoggedInUser {
  name?: string;
  email?: string;
  role?: "customer" | "admin";
}

const formatPrice = (price: number) =>
  `${price.toLocaleString("en-RW")} RWF`;

const isOrderStatus = (status: unknown): status is OrderStatus =>
  status === "Pending" ||
  status === "Processing" ||
  status === "Shipped" ||
  status === "Delivered" ||
  status === "Cancelled";

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);

  const [productStats, setProductStats] = useState<ProductStats>({
    totalProducts: 0,
    totalStock: 0,
    averagePrice: 0,
  });

  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [ordersError, setOrdersError] = useState("");

  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");

  const navigate = useNavigate();

  // Check that the logged-in user is an admin.
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
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
      setIsAuthorized(true);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const loadDashboardProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError("");

    try {
      const [productResponse, statsResponse] = await Promise.all([
        getProducts({ page: 1, limit: 50 }),
        getProductStats(),
      ]);

      setProducts(productResponse.products);
      setProductStats(statsResponse);
    } catch (error) {
      console.error("Failed to load dashboard products:", error);
      setProductsError(
        "Unable to load product information. Check your backend connection and try again."
      );
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const loadDashboardOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError("");

    try {
      // Assumes the API base URL does not already end in /api.
      const response = await api.get("/api/orders");
      const data = response.data;

      const orderList: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.orders)
          ? data.orders
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.data?.orders)
              ? data.data.orders
              : [];

      const validOrders = orderList.filter(
        (order): order is Record<string, unknown> =>
          typeof order === "object" &&
          order !== null &&
          typeof (order as Record<string, unknown>)._id === "string" &&
          isOrderStatus((order as Record<string, unknown>).status)
      );

      setOrders(
        validOrders.map((order) => ({
          _id: order._id as string,
          total: Number(order.total) || 0,
          status: order.status as OrderStatus,
        }))
      );
    } catch (error) {
      console.error("Failed to load dashboard orders:", error);
      setOrdersError(
        "Unable to load orders. Check your backend connection and order API."
      );
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const refreshDashboard = useCallback(() => {
    void Promise.all([
      loadDashboardProducts(),
      loadDashboardOrders(),
    ]);
  }, [loadDashboardProducts, loadDashboardOrders]);

  useEffect(() => {
    if (isAuthorized) {
      refreshDashboard();
    }
  }, [isAuthorized, refreshDashboard]);

  const lowStockProducts = products
    .filter((product) => product.quantity <= 5)
    .sort((a, b) => a.quantity - b.quantity);

  const activeOrders = orders.filter(
    (order) =>
      order.status !== "Delivered" &&
      order.status !== "Cancelled"
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrderValue = orders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => sum + order.total, 0);

  const stats = [
    {
      title: "Total Products",
      value: productsLoading
        ? "..."
        : productStats.totalProducts.toLocaleString("en-RW"),
      description: "Products in your catalog",
      icon: Package,
      iconClassName: "bg-orange-100 text-orange-600",
    },
    {
      title: "Total Stock",
      value: productsLoading
        ? "..."
        : productStats.totalStock.toLocaleString("en-RW"),
      description: "Items available across products",
      icon: Boxes,
      iconClassName: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Orders",
      value: ordersLoading
        ? "..."
        : orders.length.toLocaleString("en-RW"),
      description: ordersLoading
        ? "Loading orders..."
        : `${activeOrders.length} active orders`,
      icon: ShoppingBag,
      iconClassName: "bg-blue-100 text-blue-600",
    },
    {
      title: "Delivered Order Value",
      value: ordersLoading
        ? "..."
        : formatPrice(deliveredOrderValue),
      description: "Value of delivered orders",
      icon: TrendingUp,
      iconClassName: "bg-green-100 text-green-600",
    },
    {
      title: "Pending Orders",
      value: ordersLoading
        ? "..."
        : pendingOrders.toLocaleString("en-RW"),
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

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f7f5]">
        <RefreshCw
          className="animate-spin text-orange-500"
          size={30}
        />
        <span className="ml-3 text-sm text-gray-600">
          Checking administrator access...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5] text-gray-900">
      <AdminHeader
        title="Admin Dashboard"
        subtitle="Manage your fashion store in one place."
        adminName={adminName}
        adminEmail={adminEmail || "Administrator"}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-[1600px] space-y-8 p-4 sm:p-6 lg:p-8">
        {(productsError || ordersError) && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              {productsError && <p>{productsError}</p>}
              {ordersError && <p>{ordersError}</p>}
            </div>

            <button
              type="button"
              onClick={refreshDashboard}
              disabled={productsLoading || ordersLoading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 font-semibold hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

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

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={refreshDashboard}
              disabled={productsLoading || ordersLoading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  productsLoading || ordersLoading
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh Data
            </button>

            <Link
              to="/dashboard/products"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              <Plus size={18} />
              Add New Product
            </Link>
          </div>
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-lg font-bold">Store Overview</h2>
            <p className="mt-1 text-sm text-gray-500">
              Product and order figures are loaded from your backend.
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
          <div className="rounded-2xl border border-gray-200 bg-white xl:col-span-2">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5">
              <div>
                <h2 className="font-bold">Low Stock Alert</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Products with 5 or fewer items in the loaded list.
                </p>
              </div>

              <AlertTriangle className="text-amber-600" size={21} />
            </div>

            <div className="space-y-4 p-5">
              {productsLoading ? (
                <p className="py-6 text-center text-sm text-gray-500">
                  Loading inventory...
                </p>
              ) : productsError ? (
                <p className="py-6 text-center text-sm text-red-600">
                  Inventory could not be loaded.
                </p>
              ) : lowStockProducts.length > 0 ? (
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
                  <Boxes
                    size={30}
                    className="mx-auto text-green-600"
                  />
                  <p className="mt-3 text-sm font-semibold">
                    Stock looks good!
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    No low-stock products were found in the loaded list.
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

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
                <ShoppingBag size={21} />
              </div>

              <div>
                <h2 className="font-bold">Order Management</h2>
                <p className="mt-1 text-xs text-gray-500">
                  View and update customer orders.
                </p>
              </div>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              {ordersLoading
                ? "Loading orders from the backend..."
                : ordersError
                  ? "Orders could not be loaded. Check your backend connection."
                  : `You have ${orders.length} saved orders, including ${pendingOrders} pending orders.`}
            </p>

            <Link
              to="/dashboard/orders"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Manage Orders <ArrowRight size={16} />
            </Link>
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
  );
}