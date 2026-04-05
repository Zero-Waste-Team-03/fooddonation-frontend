import { useEffect } from "react";
import { useDonationsQuery } from "@/gql/graphql";
import { useAtomValue } from "jotai";
import {
  donationFiltersAtom,
  donationsPageAtom,
  donationsPageSizeAtom,
} from "@/store";

export function useDonations() {
  const page = useAtomValue(donationsPageAtom);
  const limit = useAtomValue(donationsPageSizeAtom);
  const filters = useAtomValue(donationFiltersAtom);

  const filter =
    filters.status != null ||
    filters.urgency != null ||
    (filters.category != null && filters.category.trim() !== "")
      ? {
          ...(filters.status != null ? { status: filters.status } : {}),
          ...(filters.urgency != null ? { urgency: filters.urgency } : {}),
          ...(filters.category != null && filters.category.trim() !== ""
            ? { categoryId: filters.category.trim() }
            : {}),
        }
      : undefined;

  const { data, loading, error, refetch } = useDonationsQuery({
    variables: {
      pagination: { page, limit },
      filter,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    console.groupCollapsed("[Donations Query]");
    console.log("variables", {
      pagination: { page, limit },
      filter,
    });
    console.log("loading", loading);
    console.log("error", error);
    console.log("pagination", data?.donations ?? null);
    console.log("itemsCount", data?.donations?.items?.length ?? 0);
    console.log("items", data?.donations?.items ?? []);
    console.groupEnd();
  }, [page, limit, filter, loading, error, data]);

  return {
    donations: data?.donations?.items ?? [],
    pagination: data?.donations
      ? {
          page: data.donations.page,
          limit: data.donations.limit,
          totalCount: data.donations.totalCount,
          hasNextPage: data.donations.hasNextPage,
          hasPreviousPage: data.donations.hasPreviousPage,
        }
      : null,
    loading,
    error,
    refetch,
  };
}
