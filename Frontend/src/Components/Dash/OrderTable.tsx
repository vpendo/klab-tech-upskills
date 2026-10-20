import { Eye } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
}

interface OrderTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OrderTable({
  orders,
  onViewOrder,
}: OrderTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-5 py-4 font-semibold">Order</th>
            <th className="px-5 py-4 font-semibold">Customer</th>
            <th className="px-5 py-4 font-semibold">Date</th>
            <th className="px-5 py-4 font-semibold">Items</th>
            <th className="px-5 py-4 font-semibold">Total</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 text-right font-semibold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="transition hover:bg-orange-50/30"
            >
              <td className="px-5 py-4 text-sm font-bold text-gray-900">
                {order.id}
              </td>

              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-gray-800">
                  {order.customer}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {order.email}
                </p>
              </td>

              <td className="px-5 py-4 text-sm text-gray-600">
                {new Date(`${order.date}T00:00:00`).toLocaleDateString()}
              </td>

              <td className="px-5 py-4 text-sm text-gray-600">
                {order.items}
              </td>

              <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                {formatCurrency(order.total)}
              </td>

              <td className="px-5 py-4">
                <OrderStatusBadge status={order.status} />
              </td>

              <td className="px-5 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onViewOrder(order)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-600"
                >
                  <Eye size={16} />
                  View
                </button>
              </td>
            </tr>
          ))}

          {orders.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-12 text-center text-sm text-gray-500"
              >
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}