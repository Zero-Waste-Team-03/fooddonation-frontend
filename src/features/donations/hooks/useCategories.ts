import { useCategoriesQuery } from "@/gql/graphql";

const PAGINATION = { page: 1, limit: 200 } as const;

export function useCategories() {
  const { data, loading, error, refetch } = useCategoriesQuery({
    variables: { pagination: PAGINATION },
    fetchPolicy: "cache-and-network",
  });

  return {
    categories: data?.categories?.items ?? [],
    loading,
    error,
    refetch,
  };
}
