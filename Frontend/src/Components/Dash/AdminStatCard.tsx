
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
  valueClassName?: string;
}

export default function AdminStatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName = "bg-orange-50 text-orange-600",
  valueClassName = "text-gray-900",
}: AdminStatCardProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p
            className={`mt-3 break-words text-2xl font-extrabold tracking-tight sm:text-3xl ${valueClassName}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={22} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 border-t border-gray-100 pt-4">
        <ArrowUpRight
          size={16}
          className="mt-0.5 shrink-0 text-orange-500"
        />

        <p className="text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>
    </article>
  );
}
