import { AlertTriangle, UserCheck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatMetricCard } from "@/components/ui/stat-metric-card";
import type { UserStats } from "@/types/user.types";

type UserStatsBarProps = {
  stats: UserStats | null;
  loading: boolean;
};

function formatDelta(increase: number): string {
  const sign = increase >= 0 ? "+" : "";
  return `${sign}${increase.toFixed(1)}%`;
}

function StatMetricCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card shadow-card">
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex flex-row items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="size-10 shrink-0 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </CardContent>
    </Card>
  );
}

export function UserStatsBar({ stats, loading }: UserStatsBarProps) {
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
        label="Total Users"
        value={stats.totalUsers.toLocaleString()}
        deltaLabel={formatDelta(stats.totalUsersIncrease)}
        icon={Users}
        badgeVariant={stats.totalUsersIncrease >= 0 ? "success" : "destructive"}
      />
      <StatMetricCard
        label="Active Accounts"
        value={stats.activeAccounts.toLocaleString()}
        deltaLabel={formatDelta(stats.activeAccountsIncrease)}
        icon={UserCheck}
        badgeVariant={stats.activeAccountsIncrease >= 0 ? "success" : "destructive"}
      />
      <StatMetricCard
        label="Reported Issues"
        value={stats.reportedIssues.toLocaleString()}
        deltaLabel={formatDelta(stats.reportedIssuesIncrease)}
        icon={AlertTriangle}
        badgeVariant={stats.reportedIssuesIncrease >= 0 ? "destructive" : "success"}
      />
    </div>
  );
}
