import {
  ShoppingBag,
  Clock3,
  PackageCheck,
  Heart,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description: string;
  iconColor?: string;
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  description,
  iconColor = "bg-orange-50 text-orange-500",
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6">
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
    </div>
  );
}

export default function DashboardCards() {
  const cards = [
    {
      title: "Total Orders",
      value: 0,
      icon: ShoppingBag,
      description: "All your orders",
      iconColor: "bg-orange-50 text-orange-500",
    },
    {
      title: "Pending Orders",
      value: 0,
      icon: Clock3,
      description: "Orders awaiting completion",
      iconColor: "bg-amber-50 text-amber-600",
    },
    {
      title: "Delivered Orders",
      value: 0,
      icon: PackageCheck,
      description: "Successfully delivered",
      iconColor: "bg-green-50 text-green-600",
    },
    {
      title: "Wishlist Items",
      value: 0,
      icon: Heart,
      description: "Products saved for later",
      iconColor: "bg-rose-50 text-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <DashboardCard key={card.title} {...card} />
      ))}
    </div>
  );
}