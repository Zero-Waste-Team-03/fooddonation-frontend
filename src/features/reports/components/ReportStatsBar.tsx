import { TrendingDown, TrendingUp } from "lucide-react";
import { StatMetricCard, StatMetricCardSkeleton } from "@/components/ui/stat-metric-card";
import type { ReportStats } from "@/types/report.types";

type ReportStatsBarProps = {
  stats: ReportStats | null;
  loading: boolean;
};

type StatItem = {
  label: string;
  value: string;
  isTrend: boolean;
  positive: boolean;
};

function toLabel(fieldName: string): string {
  return fieldName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toStatItems(stats: ReportStats): StatItem[] {
  const entries = Object.entries(stats).filter(
    ([key, value]) => key !== "chart" && typeof value === "number"
  );

  return entries.map(([key, value]) => {
    const trendName = key.toLowerCase();
    const isTrend =
      trendName.includes("increase") ||
      trendName.includes("rate") ||
      trendName.includes("change") ||
      trendName.includes("growth");

    if (isTrend) {
      const numericValue = Number(value);
      const sign = numericValue >= 0 ? "+" : "";

      return {
        label: toLabel(key),
        value: `${sign}${numericValue.toFixed(1)}%`,
        isTrend: true,
        positive: numericValue >= 0,
      };
    }

    return {
      label: toLabel(key),
      value: Number(value).toLocaleString(),
      isTrend: false,
      positive: true,
    };
  });
}

export function ReportStatsBar({ stats, loading }: ReportStatsBarProps) {
  if (loading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatMetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statItems = toStatItems(stats);

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {statItems.map((item) => (
        <StatMetricCard
          key={item.label}
          label={item.label}
          value={item.value}
          icon={
            item.isTrend
              ? item.positive
                ? TrendingUp
                : TrendingDown
              : undefined
          }
          badgeVariant={
            item.isTrend ? (item.positive ? "success" : "destructive") : "neutral"
          }
        />
      ))}
    </div>
  );
}
