import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  Cloud,
  Heart,
  Leaf,
  Link as LinkIcon,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatMetricCard } from "@/components/ui/stat-metric-card";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
} from "@/components/ui/map";
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
import { useState } from "react";

type OverviewKpi = {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  icon: LucideIcon;
};

const OVERVIEW_KPIS: OverviewKpi[] = [
  {
    id: "donations",
    label: "Total Donations",
    value: "12,450",
    deltaLabel: "+12.5%",
    icon: Heart,
  },
  {
    id: "users",
    label: "Active Users",
    value: "8,200",
    deltaLabel: "+5.2%",
    icon: Users,
  },
  {
    id: "food",
    label: "Food Saved (KG)",
    value: "4,500 KG",
    deltaLabel: "+18.3%",
    icon: Leaf,
  },
  {
    id: "co2",
    label: "CO2 Saved",
    value: "9.2 TONS",
    deltaLabel: "+15.0%",
    icon: Cloud,
  },
];

const DONATION_GROWTH_MONTHLY: { month: string; donations: number }[] = [
  { month: "JAN", donations: 8200 },
  { month: "FEB", donations: 7800 },
  { month: "MAR", donations: 9100 },
  { month: "APR", donations: 10200 },
  { month: "MAY", donations: 9800 },
  { month: "JUN", donations: 11100 },
  { month: "JUL", donations: 10500 },
  { month: "AUG", donations: 11800 },
  { month: "SEP", donations: 12400 },
  { month: "OCT", donations: 12100 },
  { month: "NOV", donations: 13200 },
  { month: "DEC", donations: 12800 },
];

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

function ActivityHeatmapCard() {
  return (
    <Card className="flex min-h-full flex-col overflow-hidden shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-page-title">Activity Heatmap</CardTitle>
        <CardDescription>Geographic hotspots by density</CardDescription>
      </CardHeader>
      <CardContent className="relative flex min-h-full flex-1 flex-col p-0">
        <div className="relative min-h-full flex-1 overflow-hidden rounded-b-md">
          <Map
            center={[2.3522, 48.8566]}
            zoom={11}
            className="absolute inset-0 min-h-full"
          >
            <MapControls />
            <MapMarker longitude={2.3522} latitude={48.8566}>
              <MarkerContent />
            </MapMarker>
          </Map>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute top-[18%] left-[42%] h-28 w-28 rounded-full bg-primary/35 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-[28%] bottom-[26%] h-20 w-20 rounded-full bg-primary/25 blur-xl"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-x-4 bottom-4">
            <div className="rounded-lg border border-border bg-card/95 px-3 py-2.5 text-sm shadow-dropdown backdrop-blur-sm">
              <p className="font-medium text-card-foreground">
                <span className="mr-2 inline-block size-2 rounded-full bg-primary" />
                High Density | Central District (420 donations)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewPage() {
  const { user } = useCurrentUser();
  const periods = ["7d", "30d", "12m"] as const;
  const periodLabels: Record<typeof periods[number], string> = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "12m": "Last 12 Months",
  };
  const [selectedPeriod, setSelectedPeriod] = useState<typeof periods[number]>("12m");
  return (
    <PageWrapper
      title="Dashboard Overview"
      description={"Welcome back, " + (user?.displayName ?? "User") + ". Here's what's happening today at Gasp'Zero."}
    >
      <div className="flex flex-col gap-8">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {OVERVIEW_KPIS.map((card) => {
            return (
            <StatMetricCard
              key={card.id}
              label={card.label}
              value={card.value}
              deltaLabel={card.deltaLabel}
              icon={card.icon}
            />
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border shadow-card lg:col-span-2">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-page-title">Donation Growth</CardTitle>
                <CardDescription>
                  Monthly trend across all categories
                </CardDescription>
              </div>
              <div className="relative shrink-0">
                <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as typeof periods[number])}>
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
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={DONATION_GROWTH_MONTHLY}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="overviewDonationFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--color-primary)"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--color-primary)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="var(--color-border)"
                      vertical={false}
                      strokeDasharray="4 4"
                    />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "var(--color-muted-foreground)",
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      domain={[0, 15000]}
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "var(--color-muted-foreground)",
                        fontSize: 12,
                      }}
                      tickFormatter={(v: number) =>
                        v >= 1000 ? `${v / 1000}k` : `${v}`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                        backgroundColor: "var(--color-card)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="donations"
                      name="Donations"
                      stroke="var(--color-primary)"
                      fill="url(#overviewDonationFill)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <div className="lg:col-span-1">
            <ActivityHeatmapCard />
          </div>
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
