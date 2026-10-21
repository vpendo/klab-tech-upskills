import type { OrderStatus } from "./OrderTable";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Processing: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Shipped: "bg-purple-50 text-purple-700 ring-purple-600/20",
  Delivered: "bg-green-50 text-green-700 ring-green-600/20",
  Cancelled: "bg-red-50 text-red-700 ring-red-600/20",
};

export default function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  return (
    <span
      role="status"
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
