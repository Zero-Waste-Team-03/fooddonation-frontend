import { useDonationFilterCategoriesQuery } from "@/gql/graphql";

const PAGINATION = { page: 1, limit: 200 } as const;

export function useDonationFilterCategories() {
  const { data, loading, error } = useDonationFilterCategoriesQuery({
    variables: { pagination: PAGINATION },
    fetchPolicy: "cache-and-network",
  });

  const categories = data?.categories?.items ?? [];

  return { categories, loading, error };
}
