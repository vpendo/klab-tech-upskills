
import { useEffect, useState, type FormEvent } from "react";
import {
  Settings as SettingsIcon,
  Store,
  Bell,
  Palette,
  Save,
  RotateCcw,
  Mail,
  Coins,
  Package,
  CheckCircle,
} from "lucide-react";

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  currency: string;
  defaultStatus: string;
  orderNotifications: boolean;
  stockNotifications: boolean;
  theme: string;
}

const defaultSettings: StoreSettings = {
  storeName: "PendoHub",
  storeEmail: "pendohub@gmail.com",
  currency: "RWF",
  defaultStatus: "Pending",
  orderNotifications: true,
  stockNotifications: true,
  theme: "Light",
};

const SETTINGS_KEY = "pendohub-settings";

export default function Settings() {
  const [settings, setSettings] =
    useState<StoreSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_KEY);

      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);

        setSettings({
          ...defaultSettings,
          ...parsedSettings,
        });
      }
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  const updateSetting = <K extends keyof StoreSettings>(
    key: K,
    value: StoreSettings[K],
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setSaved(true);
    } catch {
      setSaved(false);
      window.alert("Unable to save settings. Please try again.");
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);

    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(defaultSettings),
      );
      setSaved(true);
    } catch {
      setSaved(false);
      window.alert("Unable to reset settings. Please try again.");
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  const sectionClass =
    "rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6";

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-start gap-4">
          <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
            <SettingsIcon size={27} />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
              PendoHub Administration
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
              Settings
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your store preferences and admin options.
            </p>
          </div>
        </header>

        {saved && (
          <div
            role="status"
            className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700"
          >
            <CheckCircle size={20} />
            Settings saved successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Store information */}
          <section className={sectionClass}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <Store size={21} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">
                  Store information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your store's basic details.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="storeName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Store name
                </label>
                <input
                  id="storeName"
                  value={settings.storeName}
                  onChange={(event) =>
                    updateSetting("storeName", event.target.value)
                  }
                  required
                  className={inputClass}
                  placeholder="Enter store name"
                />
              </div>

              <div>
                <label
                  htmlFor="storeEmail"
                  className="text-sm font-semibold text-gray-700"
                >
                  Store email
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={(event) =>
                      updateSetting("storeEmail", event.target.value)
                    }
                    required
                    className={`${inputClass} pl-10`}
                    placeholder="store@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="currency"
                  className="text-sm font-semibold text-gray-700"
                >
                  Store currency
                </label>
                <div className="relative">
                  <Coins
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    id="currency"
                    value={settings.currency}
                    onChange={(event) =>
                      updateSetting("currency", event.target.value)
                    }
                    className={`${inputClass} pl-10`}
                  >
                    <option value="RWF">RWF - Rwandan Franc</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="defaultStatus"
                  className="text-sm font-semibold text-gray-700"
                >
                  Default order status
                </label>
                <select
                  id="defaultStatus"
                  value={settings.defaultStatus}
                  onChange={(event) =>
                    updateSetting("defaultStatus", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                </select>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className={sectionClass}>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Bell size={21} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Notifications</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Choose which alerts you want to enable.
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
                <div className="flex items-start gap-3">
                  <Package size={20} className="mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      New order notifications
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Enable alerts for new customer orders.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={settings.orderNotifications}
                  onChange={(event) =>
                    updateSetting(
                      "orderNotifications",
                      event.target.checked,
                    )
                  }
                  className="h-5 w-5 accent-orange-600"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
                <div className="flex items-start gap-3">
                  <Bell size={20} className="mt-1 text-gray-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Low-stock notifications
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Enable alerts when products are running low.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={settings.stockNotifications}
                  onChange={(event) =>
                    updateSetting(
                      "stockNotifications",
                      event.target.checked,
                    )
                  }
                  className="h-5 w-5 accent-orange-600"
                />
              </label>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              These preferences are saved locally. Actual email or
              push notifications require a notification service.
            </p>
          </section>

          {/* Appearance */}
          <section className={sectionClass}>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <Palette size={21} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Appearance</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Choose your preferred dashboard theme.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {(["Light", "Dark"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={settings.theme === option}
                  onClick={() => updateSetting("theme", option)}
                  className={`rounded-xl border-2 p-4 text-left transition ${
                    settings.theme === option
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`mb-3 h-16 rounded-lg border ${
                      option === "Light"
                        ? "border-gray-200 bg-white"
                        : "border-gray-700 bg-gray-900"
                    }`}
                  >
                    <div className="flex gap-2 p-3">
                      <div className="h-9 w-3 rounded bg-orange-500" />
                      <div className="flex-1 space-y-2">
                        <div
                          className={`h-2 w-3/4 rounded ${
                            option === "Light"
                              ? "bg-gray-200"
                              : "bg-gray-700"
                          }`}
                        />
                        <div
                          className={`h-2 w-1/2 rounded ${
                            option === "Light"
                              ? "bg-gray-100"
                              : "bg-gray-800"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-gray-900">
                    {option}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {settings.theme === option
                      ? "Selected"
                      : `Choose ${option.toLowerCase()} mode`}
                  </p>
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs text-gray-500">
              The selected theme is saved as a preference. The
              dashboard colors will not change until theme switching
              is implemented throughout the dashboard.
            </p>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <RotateCcw size={17} />
              Reset to defaults
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              <Save size={17} />
              Save changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
