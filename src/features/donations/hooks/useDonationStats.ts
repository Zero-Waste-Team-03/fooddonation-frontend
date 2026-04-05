import { useDonationStatisticsQuery } from "@/gql/graphql";

export function useDonationStats() {
  const { data, loading, error } = useDonationStatisticsQuery({
    fetchPolicy: "cache-and-network",
  });

  return {
    stats: data?.donationStatistics ?? null,
    loading,
    error,
  };
}
