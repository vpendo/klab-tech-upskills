
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import CustomerSidebar from "../../Components/Dash/CustomerSidebar";

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

const initialProfile: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
};

export default function MyProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileForm>(() => {
    try {
      const savedProfile = localStorage.getItem("pendohub-customer-profile");
      return savedProfile
        ? { ...initialProfile, ...JSON.parse(savedProfile) }
        : initialProfile;
    } catch {
      return initialProfile;
    }
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    localStorage.setItem(
      "pendohub-customer-profile",
      JSON.stringify(profile)
    );

    setSaved(true);
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const displayName =
    `${profile.firstName} ${profile.lastName}`.trim() || "Your Name";

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <CustomerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Page header */}
          <header className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-700 lg:hidden"
              aria-label="Open dashboard menu"
            >
              <UserRound size={21} />
            </button>

            <div>
              <p className="text-sm text-gray-500">My Account</p>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                My Profile
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your personal information and contact details.
              </p>
            </div>
          </header>

          {/* Profile overview */}
          <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-white/50 bg-white/20">
                <UserRound size={38} />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-orange-100">Customer Account</p>
                <h2 className="mt-1 break-words text-2xl font-bold">
                  {displayName}
                </h2>
                <p className="mt-1 break-all text-sm text-orange-50">
                  {profile.email || "Add your email address below"}
                </p>
              </div>

              <div className="sm:ml-auto">
                <ShoppingBag size={36} className="hidden text-white/80 sm:block" />
              </div>
            </div>
          </section>

          {/* Profile form */}
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Personal Information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Update the details associated with your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={profile.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={profile.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <Mail size={16} className="text-orange-500" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <Phone size={16} className="text-orange-500" />
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <MapPin size={16} className="text-orange-500" />
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={profile.address}
                    onChange={handleChange}
                    placeholder="Enter your delivery address"
                    autoComplete="street-address"
                    className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              {saved && (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700"
                >
                  <Check size={18} />
                  Your profile has been saved on this device.
                </div>
              )}

              <div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                <Link
                  to="/account"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <ArrowLeft size={17} />
                  Back to Dashboard
                </Link>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* Account security */}
          <section className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-orange-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-3 text-orange-600">
                <LockKeyhole size={22} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Account Security</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Need to change your password? Use your account's password
                  reset option.
                </p>
              </div>
            </div>

            <Link
              to="/login"
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
            >
              Account Login
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
