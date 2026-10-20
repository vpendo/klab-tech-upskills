import { X, Save } from "lucide-react";
import {
  formatCurrency,
  type Order,
  type OrderStatus,
} from "../../Components/Dash/OrderTable";
import OrderStatusBadge from "../../Components/Dash/OrderStatusBadge";

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

export default function OrderDetails({
  order,
  onClose,
  onStatusChange,
}: OrderDetailsProps) {
  const statuses: OrderStatus[] = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
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
              {order.id}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={21} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="mt-1 font-semibold text-gray-900">
              {order.customer}
            </p>
            <p className="mt-1 text-sm text-gray-600">{order.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order date</p>
              <p className="mt-1 font-semibold text-gray-900">
                {new Date(`${order.date}T00:00:00`).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Number of items</p>
              <p className="mt-1 font-semibold text-gray-900">
                {order.items}
              </p>
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
              value={order.status}
              onChange={(event) =>
                onStatusChange(
                  order.id,
                  event.target.value as OrderStatus,
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-gray-500">
            Status changes currently update frontend state only.
            Connect your backend to save changes permanently.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700"
        >
          <Save size={17} />
          Done
        </button>
      </section>
    </div>
  );
}