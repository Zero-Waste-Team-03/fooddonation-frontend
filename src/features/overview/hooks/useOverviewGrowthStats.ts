import { StatsGrowthPeriod, useAdminGrowthStatsQuery } from "@/gql/graphql";

export type OverviewGrowthPeriod = "7d" | "30d" | "12m";

const periodMap: Record<OverviewGrowthPeriod, StatsGrowthPeriod> = {
  "7d": StatsGrowthPeriod.LastWeek,
  "30d": StatsGrowthPeriod.LastMonth,
  "12m": StatsGrowthPeriod.LastYear,
};

export function useOverviewGrowthStats(period: OverviewGrowthPeriod) {
  const { data, loading, error } = useAdminGrowthStatsQuery({
    variables: {
      input: {
        period: periodMap[period],
        applyDonationStatusFilter: true,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  return {
    data: data?.adminGrowthStats.points ?? [],
    loading,
    error,
  };
}
