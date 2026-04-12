import { useAdminDashboardStatsQuery } from "@/gql/graphql";

export function useAdminDashboardStats() {
  const { data, loading, error } = useAdminDashboardStatsQuery({
    variables: {
      input: {
        applyDonationStatusFilter: true,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  return {
    stats: data?.adminDashboardStats ?? null,
    loading,
    error,
  };
}
