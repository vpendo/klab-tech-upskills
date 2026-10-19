
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  UserRound,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  adminName?: string;
  adminEmail?: string;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export default function AdminHeader({
  title = "Admin Dashboard",
  subtitle = "Manage your fashion store in one place.",
  adminName = "Store Admin",
  adminEmail = "Administrator",
  onMenuClick,
  onLogout,
}: AdminHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = adminName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:px-8">
      {/* Page title */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onMenuClick}
          className="shrink-0 rounded-xl p-2 text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
            {title}
          </h1>

          <p className="mt-1 hidden text-sm text-gray-500 sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Admin profile */}
      <div className="relative shrink-0">
        <button
          type="button"
          aria-expanded={profileOpen}
          aria-haspopup="true"
          onClick={() => setProfileOpen((open) => !open)}
          className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-orange-50 sm:gap-3 sm:p-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
            {initials || "A"}
          </div>

          <div className="hidden text-left sm:block">
            <p className="max-w-36 truncate text-sm font-semibold text-gray-900">
              {adminName}
            </p>
            <p className="max-w-36 truncate text-xs text-gray-500">
              {adminEmail}
            </p>
          </div>

          <ChevronDown
            size={16}
            className={`hidden text-gray-500 transition-transform sm:block ${
              profileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {profileOpen && (
          <>
            <button
              type="button"
              aria-label="Close profile menu"
              onClick={() => setProfileOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />

            <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
              <div className="border-b border-gray-100 px-3 py-3">
                <p className="truncate text-sm font-bold text-gray-900">
                  {adminName}
                </p>
                <p className="mt-1 truncate text-xs text-gray-500">
                  {adminEmail}
                </p>
              </div>

              <Link
                to="/dashboard/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                <UserRound size={18} />
                My Profile
              </Link>

              <Link
                to="/dashboard/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                <Settings size={18} />
                Account Settings
              </Link>

              <div className="my-1 border-t border-gray-100" />

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  onLogout?.();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
