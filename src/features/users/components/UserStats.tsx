import type { LucideIcon } from "lucide-react";
import { AlertTriangle, HeartHandshake, Users } from "lucide-react";

import { StatMetricCard } from "@/components/ui/stat-metric-card";

type UserStatItem = {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  icon: LucideIcon;
  badgeVariant: "success" | "destructive";
};

const USER_STATS: UserStatItem[] = [
  {
    id: "total-users",
    label: "Total Users",
    value: "1,240",
    deltaLabel: "+12%",
    icon: Users,
    badgeVariant: "success",
  },
  {
    id: "active-donors",
    label: "Active Donors",
    value: "856",
    deltaLabel: "+5%",
    icon: HeartHandshake,
    badgeVariant: "success",
  },
  {
    id: "reported-issues",
    label: "Reported Issues",
    value: "12",
    deltaLabel: "-2%",
    icon: AlertTriangle,
    badgeVariant: "destructive",
  },
];

export function UserStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {USER_STATS.map((item) => (
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
