
import {
  ShoppingBag,
  Clock3,
  PackageCheck,
  Heart,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description: string;
  iconColor?: string;
  to?: string;
}

interface DashboardCardsProps {
  totalOrders?: number;
  pendingOrders?: number;
  deliveredOrders?: number;
  wishlistItems?: number;
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  description,
  iconColor = "bg-orange-50 text-orange-500",
  to,
}: DashboardCardProps) {
  const cardContent = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-black">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconColor}`}
        >
          <Icon size={23} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
        <ArrowUpRight size={16} className="text-orange-500" />
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </>
  );

  const cardClassName =
    "block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6";

  if (to) {
    return (
      <Link
        to={to}
        className={`${cardClassName} hover:border-rose-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
        aria-label={`${title}: ${value}. ${description}. View wishlist`}
      >
        {cardContent}
      </Link>
    );
  }

  return <div className={cardClassName}>{cardContent}</div>;
}

export default function DashboardCards({
  totalOrders = 0,
  pendingOrders = 0,
  deliveredOrders = 0,
  wishlistItems = 0,
}: DashboardCardsProps) {
  const cards: (DashboardCardProps & { key: string })[] = [
    {
      key: "orders",
      title: "My Orders",
      value: totalOrders,
      icon: ShoppingBag,
      description: "All your orders",
      iconColor: "bg-orange-50 text-orange-500",
    },
    {
      key: "pending",
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock3,
      description: "Orders awaiting completion",
      iconColor: "bg-amber-50 text-amber-600",
    },
    {
      key: "delivered",
      title: "Delivered Orders",
      value: deliveredOrders,
      icon: PackageCheck,
      description: "Successfully delivered",
      iconColor: "bg-green-50 text-green-600",
    },
    {
      key: "wishlist",
      title: "My Wishlist",
      value: wishlistItems,
      icon: Heart,
      description: "View your saved products",
      iconColor: "bg-rose-50 text-rose-500",
      to: "/wishlist",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, ...card }) => (
        <DashboardCard key={key} {...card} />
      ))}
    </div>
  );
}
