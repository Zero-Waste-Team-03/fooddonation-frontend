import type { LucideIcon } from "lucide-react";
import { AlertCircle, ClipboardList, ShoppingBag } from "lucide-react";

import { StatMetricCard } from "@/components/ui/stat-metric-card";

type DonationStatItem = {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  icon: LucideIcon;
  badgeVariant: "success" | "destructive" | "warning";
};

const DONATION_STATS: DonationStatItem[] = [
  {
    id: "total-active",
    label: "Total Active Donations",
    value: "452",
    deltaLabel: "+12% from yesterday",
    icon: ShoppingBag,
    badgeVariant: "success",
  },
  {
    id: "flagged-items",
    label: "Flagged Items",
    value: "8",
    deltaLabel: "Requires immediate review",
    icon: AlertCircle,
    badgeVariant: "destructive",
  },
  {
    id: "pending-approvals",
    label: "Pending Approvals",
    value: "15",
    deltaLabel: "Avg wait: 14 mins",
    icon: ClipboardList,
    badgeVariant: "warning",
  },
];

export function DonationStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {DONATION_STATS.map((item) => (
        <StatMetricCard
          key={item.id}
          label={item.label}
          value={item.value}
          deltaLabel={item.deltaLabel}
          icon={item.icon}
          badgeVariant={item.badgeVariant}
        />
      ))}
    </div>
  );
}
