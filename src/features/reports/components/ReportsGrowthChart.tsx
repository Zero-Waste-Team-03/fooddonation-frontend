import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { GrowthDataPoint, ReportPeriod } from "@/types/report.types";
import type { ReportStatsPoint } from "@/gql/graphql";

type ReportsGrowthChartProps = {
  data: GrowthDataPoint[];
  reportSeries: ReportStatsPoint[];
  loading: boolean;
  period: ReportPeriod;
};

type ChartDatum = {
  period: string;
  reportsCount: number;
  growthValue: number;
};

const REPORTS_COLOR = "#E24B4A";
const GROWTH_COLOR = "#2d6a4f";

function formatTick(value: string, period: ReportPeriod): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  if (period === "LAST_YEAR") {
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

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function mergeSeries(reportSeries: ReportStatsPoint[], growthSeries: GrowthDataPoint[]): ChartDatum[] {
  const growthByPeriod = new Map<string, number>();

  growthSeries.forEach((item) => {
    growthByPeriod.set(item.period, item.usersCount);
  });

  return reportSeries.map((item) => ({
    period: item.period,
    reportsCount: item.reportsCount,
    growthValue: growthByPeriod.get(item.period) ?? 0,
  }));
}

type TooltipPayloadItem = {
  value?: number | string;
  color?: string;
  name?: string;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<TooltipPayloadItem>;
  label?: string | number;
  period: ReportPeriod;
};

function ChartTooltip({ active, payload, label, period }: ChartTooltipProps) {
  if (!active || !payload?.length || !label) {
    return null;
  }

  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-dropdown">
      <p className="mb-2 text-xs font-semibold text-foreground">{formatTick(String(label), period)}</p>
      <div className="space-y-1.5 text-xs text-muted-foreground">
        {payload.map((item, index) => (
          <div key={`${item.name ?? "series"}-${index}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-[2px]"
                style={{ backgroundColor: item.color ?? "var(--color-muted-foreground)" }}
              />
              <span>{item.name ?? "Value"}</span>
            </div>
            <span className="font-semibold text-foreground">
              {formatNumber(Number(item.value ?? 0))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportsGrowthChart({
  data,
  reportSeries,
  loading,
  period,
}: ReportsGrowthChartProps) {
  if (loading) {
    return <Skeleton className="h-[320px] w-full rounded-lg" />;
  }

  const chartData = mergeSeries(reportSeries, data);

  if (chartData.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
        No growth data available
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="var(--color-border)" vertical={false} strokeDasharray="4 4" />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            tickFormatter={(value) => formatTick(String(value), period)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            tickFormatter={(value) => formatNumber(Number(value))}
          />
          <Tooltip
            cursor={{ stroke: "var(--color-border)", strokeDasharray: "3 3" }}
            content={(props) => (
              <ChartTooltip
                active={props.active}
                payload={props.payload as ReadonlyArray<TooltipPayloadItem> | undefined}
                label={props.label}
                period={period}
              />
            )}
          />
          <Legend verticalAlign="bottom" iconType="square" wrapperStyle={{ paddingTop: 16 }} />
          <Line
            type="monotone"
            dataKey="reportsCount"
            name="Reports"
            stroke={REPORTS_COLOR}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="growthValue"
            name="Growth"
            stroke={GROWTH_COLOR}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
