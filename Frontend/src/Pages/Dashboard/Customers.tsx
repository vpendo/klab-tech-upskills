
import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Users, LoaderCircle } from "lucide-react";
import api from "../../services/api";

interface Customer {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/users/customers");

      setCustomers(response.data.customers ?? []);
    } catch (err) {
      console.error("Failed to load customers:", err);
      setError("Could not load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Customers
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View customers registered with PendoHub.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchCustomers()}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
              <Users size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total registered customers
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-gray-500">
              <LoaderCircle className="animate-spin" size={22} />
              Loading customers...
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="mb-4 text-sm text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => void fetchCustomers()}
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Try again
              </button>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="font-semibold text-gray-800">
                No customers yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Registered customer accounts will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">
                      Registration date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {customers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-orange-50/40">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                        {customer.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {customer.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
