import { AlertCircle, ClipboardList, ShoppingBag } from "lucide-react";
import { StatMetricCard, StatMetricCardSkeleton } from "@/components/ui/stat-metric-card";
import type { DonationStatistics } from "@/types/donation.types";

type DonationStatsBarProps = {
  stats: DonationStatistics | null;
  loading: boolean;
};

export function DonationStatsBar({ stats, loading }: DonationStatsBarProps) {
  if (loading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatMetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <StatMetricCard
        label="Total Active Donations"
        value={stats.totalActiveDonations.toLocaleString()}
        icon={ShoppingBag}
      />
      <StatMetricCard
        label="Flagged Items"
        value={stats.flaggedItems.toLocaleString()}
        icon={AlertCircle}
      />
      <StatMetricCard
        label="Pending Approvals"
        value={stats.pendingApprovals.toLocaleString()}
        icon={ClipboardList}
      />
    </div>
  );
}
