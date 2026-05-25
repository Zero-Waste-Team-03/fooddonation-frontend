import { useAtomValue } from "jotai";
import { useAdminReportsQuery } from "@/gql/graphql";
import {
  reportFiltersAtom,
  reportPeriodAtom,
  reportsPageAtom,
  reportsPageSizeAtom,
} from "@/store";
import { buildReportsQueryVariables } from "../utils/buildReportsQueryVariables";

export function useReports() {
  const page = useAtomValue(reportsPageAtom);
  const limit = useAtomValue(reportsPageSizeAtom);
  const filters = useAtomValue(reportFiltersAtom);
  const period = useAtomValue(reportPeriodAtom);

  void period;

  const variables = buildReportsQueryVariables(page, limit, filters);

  const { data, loading, error, refetch } = useAdminReportsQuery({
    variables,
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
