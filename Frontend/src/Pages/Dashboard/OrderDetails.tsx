import { useEffect, useState } from "react";
import { X, Save, LoaderCircle, AlertCircle } from "lucide-react";

import {
  formatCurrency,
  type Order,
  type OrderStatus,
} from "../../Components/Dash/OrderTable";
import OrderStatusBadge from "../../Components/Dash/OrderStatusBadge";

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
  onStatusChange: (
    orderId: string,
    status: OrderStatus
  ) => Promise<void>;
  updatingStatus?: boolean;
}

export default function OrderDetails({
  order,
  onClose,
  onStatusChange,
  updatingStatus = false,
}: OrderDetailsProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>(order.status);
  const [saveError, setSaveError] = useState("");

  const statuses: OrderStatus[] = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  useEffect(() => {
    setSelectedStatus(order.status);
    setSaveError("");
  }, [order._id, order.status]);

  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const hasStatusChanged = selectedStatus !== order.status;

  const handleSave = async () => {
    if (!hasStatusChanged || updatingStatus) return;

    setSaveError("");

    try {
      await onStatusChange(order._id, selectedStatus);
      onClose();
    } catch {
      setSaveError(
        "Unable to save the order status. Please try again."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
        className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-orange-600">
              Order details
            </p>

            <h2
              id="order-details-title"
              className="mt-1 text-xl font-extrabold text-gray-900"
            >
              #{order._id.slice(-6).toUpperCase()}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={updatingStatus}
            aria-label="Close order details"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="mt-1 font-semibold text-gray-900">
              {order.customerName}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {order.email}
            </p>
            {order.phone && (
              <p className="mt-1 text-sm text-gray-600">
                {order.phone}
              </p>
            )}
          </div>

          {order.address && (
            <div>
              <p className="text-sm text-gray-500">
                Shipping address
              </p>
              <p className="mt-1 text-sm text-gray-800">
                {order.address}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order date</p>
              <p className="mt-1 font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total quantity
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                {totalItems}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-gray-800">
              Ordered products
            </p>

            <div className="max-h-48 space-y-3 overflow-y-auto">
              {order.items.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-gray-800">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}

              {order.items.length === 0 && (
                <p className="text-sm text-gray-500">
                  No products found for this order.
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Order total</p>
            <p className="mt-1 text-xl font-extrabold text-gray-900">
              {formatCurrency(order.total)}
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-gray-800">
              Order status
            </p>

            <div className="mb-3">
              <OrderStatusBadge status={order.status} />
            </div>

            <select
              aria-label="Change order status"
              value={selectedStatus}
              disabled={updatingStatus}
              onChange={(event) => {
                setSelectedStatus(
                  event.target.value as OrderStatus
                );
                setSaveError("");
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {saveError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{saveError}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={updatingStatus}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={updatingStatus || !hasStatusChanged}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updatingStatus ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save status
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
