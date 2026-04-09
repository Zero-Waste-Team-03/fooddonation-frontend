import { useDonationsMapQuery } from "@/gql/graphql";

const DEFAULT_INPUT = {
  latitude: 36.7538,
  longitude: 3.0588,
  radius: 50,
} as const;

export function useDonationsHeatmap() {
  const { data, loading, error, refetch } = useDonationsMapQuery({
    variables: {
      input: DEFAULT_INPUT,
    },
    fetchPolicy: "cache-and-network",
  });

  return {
    data: data?.donationsMap ?? [],
    loading,
    error,
    refetch,
  };
}
