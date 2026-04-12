import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  Heart,
  Leaf,
  Link as LinkIcon,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatMetricCard, StatMetricCardSkeleton } from "@/components/ui/stat-metric-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrentUser } from "@/features/settings/hooks/useCurrentUser";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { DonationsHeatmapMap } from "../components/DonationsHeatmapMap";
import { useAdminDashboardStats } from "../hooks/useAdminDashboardStats";
import {
  useOverviewGrowthStats,
  type OverviewGrowthPeriod,
} from "../hooks/useOverviewGrowthStats";

type OverviewKpi = {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  icon: LucideIcon;
};

type UrgentActionRow = {
  id: string;
  issueTitle: string;
  issueDetail: string;
  relatedUser: string;
  dateReported: string;
  priority: "urgent" | "medium" | "low";
  actionLabel: string;
};

const URGENT_ACTIONS: UrgentActionRow[] = [
  {
    id: "1",
    issueTitle: "Expiring Item Flagged",
    issueDetail: "ID: #DON-92831",
    relatedUser: "Marco Rossi",
    dateReported: "Today, 10:24 AM",
    priority: "urgent",
    actionLabel: "Resolve",
  },
  {
    id: "2",
    issueTitle: "Inappropriate Post",
    issueDetail: "Reported by 3 users",
    relatedUser: "Unknown User",
    dateReported: "Yesterday, 04:15 PM",
    priority: "medium",
    actionLabel: "Review",
  },
  {
    id: "3",
    issueTitle: "Verification Request",
    issueDetail: "Business: Green Grocery Ltd.",
    relatedUser: "Elena Smith",
    dateReported: "Oct 24, 2023",
    priority: "low",
    actionLabel: "Approve",
  },
];

function priorityBadgeVariant(
  p: UrgentActionRow["priority"],
): "destructive" | "warning" | "info" {
  if (p === "urgent") return "destructive";
  if (p === "medium") return "warning";
  return "info";
}

function priorityLabel(p: UrgentActionRow["priority"]): string {
  if (p === "urgent") return "Urgent";
  if (p === "medium") return "Medium";
  return "Low";
}

function formatNumber(value: number): string {
  return Number.isInteger(value)
    ? value.toLocaleString()
    : value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

function formatDelta(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatChartTick(value: string, period: OverviewGrowthPeriod): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  if (period === "12m") {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "2-digit",
    }).format(parsed);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parsed);
}

export function OverviewPage() {
  const { user } = useCurrentUser();
  const { stats: dashboardStats, loading: dashboardStatsLoading } = useAdminDashboardStats();
  const periods: OverviewGrowthPeriod[] = ["7d", "30d", "12m"];
  const periodLabels: Record<typeof periods[number], string> = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "12m": "Last 12 Months",
  };
  const [selectedPeriod, setSelectedPeriod] = useState<OverviewGrowthPeriod>("12m");
  const { data: growthStats, loading: growthLoading } = useOverviewGrowthStats(selectedPeriod);

  const growthChartData = useMemo(
    () => growthStats.map((point) => ({ period: point.period, growth: point.donationsCount })),
    [growthStats]
  );

  const overviewKpis = useMemo<OverviewKpi[]>(() => {
    return [
      {
        id: "donations",
        label: "Total Donations",
        value: formatNumber(dashboardStats?.totalDonations ?? 0),
        deltaLabel: formatDelta(dashboardStats?.totalDonationsIncrease ?? 0),
        icon: Heart,
      },
      {
        id: "users",
        label: "Active Users",
        value: formatNumber(dashboardStats?.activeUsers ?? 0),
        deltaLabel: formatDelta(dashboardStats?.activeUsersIncrease ?? 0),
        icon: Users,
      },
      {
        id: "food",
        label: "Food Saved (KG)",
        value: `${formatNumber(dashboardStats?.foodSavedKg ?? 0)} KG`,
        deltaLabel: formatDelta(dashboardStats?.foodSavedKgIncrease ?? 0),
        icon: Leaf,
      },
      {
        id: "co2",
        label: "CO2 Saved",
        value: `${formatNumber(dashboardStats?.co2SavedKg ?? 0)} KG`,
        deltaLabel: formatDelta(dashboardStats?.co2SavedKgIncrease ?? 0),
        icon: Cloud,
      },
    ];
  }, [dashboardStats]);

  return (
    <PageWrapper
      title="Dashboard Overview"
      description={"Welcome back, " + (user?.displayName ?? "User") + ". Here's what's happening today at Gasp'Zero."}
    >
      <div className="flex flex-col gap-8">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStatsLoading
            ? Array.from({ length: 4 }).map((_, i) => <StatMetricCardSkeleton key={i} />)
            : overviewKpis.map((card) => (
                <StatMetricCard
                  key={card.id}
                  label={card.label}
                  value={card.value}
                  deltaLabel={card.deltaLabel}
                  icon={card.icon}
                />
              ))}
        </div>

        <div className="rounded-lg border border-border bg-card p-4 md:p-6">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            Donation activity map
          </h2>
          <DonationsHeatmapMap />
        </div>

        <div className="grid gap-6 lg:grid-cols-1">
          <Card className="border-border shadow-card">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-page-title">Donation Growth</CardTitle>
                <CardDescription>
                  Monthly trend across all categories
                </CardDescription>
              </div>
              <div className="relative shrink-0">
                <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as OverviewGrowthPeriod)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((role) => (
                      <SelectItem key={role} value={role}>
                        {periodLabels[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[280px] w-full min-w-0">
                {growthLoading ? (
                  <Skeleton className="h-full w-full rounded-lg" />
                ) : growthChartData.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    No growth data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={growthChartData}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        stroke="var(--color-border)"
                        vertical={false}
                        strokeDasharray="4 4"
                      />
                      <XAxis
                        dataKey="period"
                        tickLine={false}
                        axisLine={false}
                        tick={{
                          fill: "var(--color-muted-foreground)",
                          fontSize: 12,
                        }}
                        tickFormatter={(value) => formatChartTick(String(value), selectedPeriod)}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{
                          fill: "var(--color-muted-foreground)",
                          fontSize: 12,
                        }}
                        tickFormatter={(v: number) =>
                          v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--color-border)",
                          backgroundColor: "var(--color-card)",
                        }}
                        labelFormatter={(label) => formatChartTick(String(label), selectedPeriod)}
                        formatter={(value) => [formatNumber(Number(value)), "Growth"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="growth"
                        name="Growth"
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border shadow-card">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-page-title">Recent Urgent Actions</CardTitle>
            <Button
              type="button"
              variant="link"
              className="h-auto gap-1.5 p-0 text-primary"
            >
              <LinkIcon className="size-4" aria-hidden />
              View All Notifications
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead>Related User</TableHead>
                  <TableHead>Date Reported</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {URGENT_ACTIONS.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-card-foreground">
                          {row.issueTitle}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {row.issueDetail}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.relatedUser}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.dateReported}
                    </TableCell>
                    <TableCell>
                      <Badge variant={priorityBadgeVariant(row.priority)}>
                        {priorityLabel(row.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button type="button" variant="outline" size="sm">
                        {row.actionLabel}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          © 2023 Gasp&apos;Zero Admin Console. All rights reserved. Fighting food
          waste, one donation at a time.
        </p>
      </div>
    </PageWrapper>
  );
}
