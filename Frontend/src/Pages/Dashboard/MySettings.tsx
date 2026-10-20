
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Check,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import CustomerSidebar from "../../Components/Dash/CustomerSidebar";

interface CustomerSettings {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  savePreferences: boolean;
}

const defaultSettings: CustomerSettings = {
  emailNotifications: true,
  orderUpdates: true,
  promotions: false,
  savePreferences: true,
};

function getSavedSettings(): CustomerSettings {
  try {
    const saved = localStorage.getItem("pendohub-customer-settings");

    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) };
    }
  } catch {
    // Use default settings if saved data cannot be read.
  }

  return defaultSettings;
}

export default function MySettings() {
  const [settings, setSettings] =
    useState<CustomerSettings>(getSavedSettings);
  const [savedMessage, setSavedMessage] = useState("");

  const updateSetting = (
    name: keyof CustomerSettings,
    value: boolean
  ) => {
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
    setSavedMessage("");
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      localStorage.setItem(
        "pendohub-customer-settings",
        JSON.stringify(settings)
      );
      setSavedMessage("Your settings have been saved successfully.");
    } catch {
      setSavedMessage(
        "Settings could not be saved. Check your browser storage."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CustomerSidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            <Link
              to="/account"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-orange-600"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </Link>

            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-600">
                My Account
              </p>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Settings
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your PendoHub preferences and notifications.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Notifications */}
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-gray-100 p-5 sm:p-6">
                  <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                    <Bell size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Notifications
                    </h2>
                    <p className="text-sm text-gray-500">
                      Choose what updates you would like to receive.
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-gray-100 px-5 sm:px-6">
                  <SettingToggle
                    title="Email notifications"
                    description="Receive account-related notifications by email."
                    checked={settings.emailNotifications}
                    onChange={(value) =>
                      updateSetting("emailNotifications", value)
                    }
                    icon={<Mail size={19} />}
                  />

                  <SettingToggle
                    title="Order updates"
                    description="Keep track of your orders and their status."
                    checked={settings.orderUpdates}
                    onChange={(value) =>
                      updateSetting("orderUpdates", value)
                    }
                    icon={<ShoppingBag size={19} />}
                  />

                  <SettingToggle
                    title="Promotions and offers"
                    description="Receive information about sales and new arrivals."
                    checked={settings.promotions}
                    onChange={(value) =>
                      updateSetting("promotions", value)
                    }
                    icon={<Bell size={19} />}
                  />
                </div>
              </section>

              {/* Privacy */}
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-gray-100 p-5 sm:p-6">
                  <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Privacy and preferences
                    </h2>
                    <p className="text-sm text-gray-500">
                      Manage how this browser remembers your preferences.
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6">
                  <SettingToggle
                    title="Remember my preferences"
                    description="Keep your saved settings on this device."
                    checked={settings.savePreferences}
                    onChange={(value) =>
                      updateSetting("savePreferences", value)
                    }
                    icon={<LockKeyhole size={19} />}
                  />
                </div>

                <div className="mx-5 mb-5 rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600 sm:mx-6">
                  Your settings are stored in this browser. They are not
                  synchronized with a server or other devices.
                </div>
              </section>

              {/* Account links */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Account management
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Need to update your personal details?
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Link
                    to="/account/profile"
                    className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-orange-300 hover:bg-orange-50"
                  >
                    <span className="flex items-center gap-3">
                      <UserRound className="text-orange-600" size={20} />
                      <span>
                        <span className="block font-semibold text-gray-900">
                          My Profile
                        </span>
                        <span className="text-sm text-gray-500">
                          Edit personal information
                        </span>
                      </span>
                    </span>
                    <ArrowLeft
                      className="rotate-180 text-gray-400"
                      size={18}
                    />
                  </Link>

                  <Link
                    to="/shop"
                    className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-orange-300 hover:bg-orange-50"
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingBag className="text-orange-600" size={20} />
                      <span>
                        <span className="block font-semibold text-gray-900">
                          Continue Shopping
                        </span>
                        <span className="text-sm text-gray-500">
                          Explore shoes and clothes
                        </span>
                      </span>
                    </span>
                    <ArrowLeft
                      className="rotate-180 text-gray-400"
                      size={18}
                    />
                  </Link>
                </div>
              </section>

              {/* Save */}
              <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="text-sm">
                  {savedMessage && (
                    <p className="flex items-center gap-2 font-medium text-green-700">
                      <Check size={18} />
                      {savedMessage}
                    </p>
                  )}
                  {!savedMessage && (
                    <p className="text-gray-500">
                      Save your changes before leaving this page.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  <Save size={18} />
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

interface SettingToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: React.ReactNode;
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
  icon,
}: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-1 text-gray-500">{icon}</div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-orange-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
