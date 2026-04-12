import { useAtomValue } from "jotai";
import { StatsGrowthPeriod, useAdminGrowthStatsQuery } from "@/gql/graphql";
import { reportPeriodAtom } from "@/store";
import type { ReportPeriod } from "@/types/report.types";

const reportPeriodToGrowthPeriod: Record<ReportPeriod, StatsGrowthPeriod> = {
  LAST_WEEK: StatsGrowthPeriod.LastWeek,
  LAST_MONTH: StatsGrowthPeriod.LastMonth,
  LAST_YEAR: StatsGrowthPeriod.LastYear,
};

export function useGrowthStats() {
  const period = useAtomValue(reportPeriodAtom);

  const { data, loading, error } = useAdminGrowthStatsQuery({
    variables: {
      input: {
        period: reportPeriodToGrowthPeriod[period],
      },
    },
    fetchPolicy: "cache-and-network",
  });

  return {
    data: data?.adminGrowthStats?.points ?? [],
    loading,
    error,
  };
}
