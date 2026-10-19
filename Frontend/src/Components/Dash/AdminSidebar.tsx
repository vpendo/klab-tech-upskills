
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  Store,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
  pendingOrders?: number;
}

export default function AdminSidebar({
  isOpen = false,
  onClose,
  onLogout,
  pendingOrders = 0,
}: AdminSidebarProps) {
  const links = [
    {
      name: "Dashboard",
      path: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/dashboard/products",
      icon: Package,
    },
    {
      name: "Orders",
      path: "/dashboard/orders",
      icon: ShoppingBag,
      badge: pendingOrders,
    },
    {
      name: "Customers",
      path: "/dashboard/customers",
      icon: Users,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-gray-100 px-5">
          <NavLink
            to="/dashboard/admin"
            onClick={onClose}
            className="text-2xl font-black tracking-tight text-black"
          >
            PENDO<span className="text-orange-500">HUB</span>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-500 hover:bg-orange-50 hover:text-orange-600 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin identity */}
        <div className="mx-4 mt-5 rounded-xl bg-orange-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
            Workspace
          </p>
          <p className="mt-1 font-bold text-gray-900">
            Store Administration
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Manage your fashion store
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Main menu
          </p>

          {links.map(({ name, path, icon: Icon, badge }) => (
            <NavLink
              key={name}
              to={path}
              end={path === "/dashboard/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} />
                  <span className="flex-1">{name}</span>

                  {name === "Orders" && badge !== undefined && badge > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive
                          ? "bg-white text-orange-600"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {badge}
                    </span>
                  )}

                  {isActive && (
                    <ChevronRight size={16} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="shrink-0 space-y-2 border-t border-gray-100 p-4">
          <NavLink
            to="/shop"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
          >
            <Store size={19} />
            <span>View Store</span>
          </NavLink>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
