import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { ActivityPoint, MetricCardData } from "@/types/analytics.types";

const METRIC_CARDS: MetricCardData[] = [
  {
    id: "donations",
    label: "Total Donations",
    value: "12,450",
    deltaLabel: "+12.5%",
    trend: "up",
  },
  {
    id: "weight",
    label: "Food Saved (kg)",
    value: "45,200",
    deltaLabel: "+8.2%",
    trend: "up",
  },
  {
    id: "users",
    label: "Active Users",
    value: "3,890",
    deltaLabel: "+2.1%",
    trend: "up",
  },
];

const ACTIVITY_SERIES: ActivityPoint[] = [
  { label: "Mon", donations: 120, users: 40 },
  { label: "Tue", donations: 180, users: 55 },
  { label: "Wed", donations: 150, users: 48 },
  { label: "Thu", donations: 210, users: 62 },
  { label: "Fri", donations: 260, users: 70 },
  { label: "Sat", donations: 190, users: 52 },
  { label: "Sun", donations: 140, users: 44 },
];

export function AnalyticsPage() {
  return (
    <PageWrapper
      title="Dashboard Overview"
      description="Welcome back, Sarah. Here's what's happening today at Gasp'Zero."
    >
      <div className="flex flex-col gap-8">
        <div className="grid gap-6 md:grid-cols-3">
          {METRIC_CARDS.map((card) => (
            <Card
              key={card.id}
              className="overflow-hidden rounded-md border-border bg-card shadow-card"
            >
              <CardContent className="flex flex-col gap-6 p-6">
                <div className="flex flex-row items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.label}
                    </p>
                    <p className="font-display text-2xl font-bold text-page-title">
                      {card.value}
                    </p>
                  </div>
                  <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-semibold text-success">
                    {card.deltaLabel}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="rounded-md border-border shadow-card">
          <CardContent className="p-6">
            <div className="mb-6 flex flex-col gap-1">
              <h2 className="font-display text-lg font-semibold text-page-title">
                Platform activity
              </h2>
              <p className="text-sm text-muted-foreground">
                Donations and active users over the last week.
              </p>
            </div>
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={ACTIVITY_SERIES}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillDonations" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
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
                    fill="url(#fillDonations)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="Users"
                    stroke="var(--color-info)"
                    fill="transparent"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
