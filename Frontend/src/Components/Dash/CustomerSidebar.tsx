import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  UserRound,
  Settings,
  Store,
  LogOut,
  X,
} from "lucide-react";

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export default function DashboardSidebar({
  isOpen = true,
  onClose,
  onLogout,
}: DashboardSidebarProps) {
  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Orders",
      path: "/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      name: "My Wishlist",
      path: "/wishlist",
      icon: Heart,
    },
    {
      name: "My Profile",
      path: "/dashboard/profile",
      icon: UserRound,
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
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* PendoHub logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-5">
          <NavLink
            to="/"
            onClick={onClose}
            className="text-2xl font-extrabold tracking-tight text-black"
          >
            Pendo<span className="text-orange-500">Hub</span>
          </NavLink>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-orange-50 hover:text-orange-500 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Customer information */}
        <div className="border-b border-gray-100 px-5 py-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            My Account
          </p>

          <h2 className="mt-2 text-lg font-bold text-black">
            Customer Dashboard
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your shopping
          </p>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-5">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              end={path === "/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                  <span>{name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom navigation */}
        <div className="space-y-2 border-t border-gray-100 p-4">
          <NavLink
            to="/shop"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
          >
            <Store size={20} />
            <span>Continue Shopping</span>
          </NavLink>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}