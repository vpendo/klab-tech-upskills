
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Heart,
  UserRound,
  Settings,
  Store,
  LogOut,
  X,
} from "lucide-react";

interface CustomerSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

const links = [
  {
    name: "Dashboard",
    path: "/account",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "My Orders",
    path: "/account/orders",
    icon: ShoppingBag,
  },
  {
    name: "My Cart",
    path: "/account/cart",
    icon: ShoppingCart,
  },
  {
    name: "My Wishlist",
    path: "/account/wishlist",
    icon: Heart,
  },
  {
    name: "My Profile",
    path: "/account/profile",
    icon: UserRound,
  },
  {
    name: "Settings",
    path: "/account/settings",
    icon: Settings,
  },
];

export default function CustomerSidebar({
  isOpen = false,
  onClose,
  onLogout,
}: CustomerSidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        id="customer-sidebar"
        aria-label="Customer navigation"
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-gray-100 px-5">
          <NavLink
            to="/account"
            end
            onClick={onClose}
            className="text-2xl font-extrabold tracking-tight text-black"
          >
            Pendo<span className="text-orange-500">Hub</span>
          </NavLink>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-orange-50 hover:text-orange-500 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Account heading */}
        <div className="border-b border-gray-100 px-5 py-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            My Account
          </p>

          <h2 className="mt-2 text-lg font-bold text-gray-900">
            Customer Dashboard
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your shopping
          </p>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Customer menu"
          className="flex-1 space-y-2 overflow-y-auto px-3 py-5"
        >
          {links.map(({ name, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
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
                    aria-hidden="true"
                  />
                  <span>{name}</span>
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
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
          >
            <Store size={20} aria-hidden="true" />
            <span>Shop Products</span>
          </NavLink>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={20} aria-hidden="true" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
