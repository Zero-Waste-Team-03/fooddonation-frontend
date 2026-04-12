import { useAtomValue } from "jotai";
import { useAdminReportsQuery } from "@/gql/graphql";
import {
  reportFiltersAtom,
  reportPeriodAtom,
  reportsPageAtom,
  reportsPageSizeAtom,
} from "@/store";

export function useReports() {
  const page = useAtomValue(reportsPageAtom);
  const limit = useAtomValue(reportsPageSizeAtom);
  const filters = useAtomValue(reportFiltersAtom);
  const period = useAtomValue(reportPeriodAtom);

  void period;

  const { data, loading, error, refetch } = useAdminReportsQuery({
    variables: {
      page,
      limit,
      status: filters.status ?? undefined,
      targetType: filters.type ?? undefined,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    reports: data?.adminReports?.items ?? [],
    pagination: data?.adminReports
      ? {
          page: data.adminReports.page,
          limit: data.adminReports.limit,
          totalCount: data.adminReports.totalCount,
          hasNextPage: data.adminReports.hasNextPage,
          hasPreviousPage: data.adminReports.hasPreviousPage,
        }
      : null,
    loading,
    error,
    refetch,
  };
}
