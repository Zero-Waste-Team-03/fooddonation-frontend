import { useAtom } from "jotai";
import type { ReportStatsPoint } from "@/gql/graphql";
import { reportPeriodAtom } from "@/store";
import type { GrowthDataPoint } from "@/types/report.types";
import { PeriodSelector } from "./PeriodSelector";
import { ReportsGrowthChart } from "./ReportsGrowthChart";

type ReportsChartCardProps = {
  data: GrowthDataPoint[];
  reportSeries: ReportStatsPoint[];
  loading: boolean;
};

export function ReportsChartCard({
  data,
  reportSeries,
  loading,
}: ReportsChartCardProps) {
  const [period, setPeriod] = useAtom(reportPeriodAtom);

  return (
    <div className="rounded-lg border border-border bg-card p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">Reports & growth</h2>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>
      <ReportsGrowthChart
        data={data}
        reportSeries={reportSeries}
        loading={loading}
        period={period}
      />
    </div>
  );
}
