import { useAdminGetUserStatsQuery } from "@/gql/graphql";

export function useUserStats() {
  const { data, loading, error } = useAdminGetUserStatsQuery({
    fetchPolicy: "cache-and-network",
  });

  return {
    stats: data?.adminGetUserStats ?? null,
    loading,
    error,
  };
}
