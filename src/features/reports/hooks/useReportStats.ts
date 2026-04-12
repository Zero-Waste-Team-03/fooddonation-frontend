import { useAtomValue } from "jotai";
import { ReportStatsPeriod, useAdminReportStatsQuery } from "@/gql/graphql";
import { reportPeriodAtom } from "@/store";
import type { ReportPeriod } from "@/types/report.types";

const reportPeriodToStatsPeriod: Record<ReportPeriod, ReportStatsPeriod> = {
  LAST_WEEK: ReportStatsPeriod.LastWeek,
  LAST_MONTH: ReportStatsPeriod.LastMonth,
  LAST_YEAR: ReportStatsPeriod.LastYear,
};

export function useReportStats() {
  const period = useAtomValue(reportPeriodAtom);

  const { data, loading, error } = useAdminReportStatsQuery({
    variables: {
      input: {
        period: reportPeriodToStatsPeriod[period],
      },
    },
    fetchPolicy: "cache-and-network",
  });

  return {
    stats: data?.adminReportStats ?? null,
    loading,
    error,
  };
}
