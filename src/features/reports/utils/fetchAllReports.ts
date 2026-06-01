import { AdminReportsDocument, type AdminReportsQuery } from "@/gql/graphql";
import { fetchAllPaginated } from "@/lib/fetchAllPaginated";
import type { Report, ReportFilters } from "@/types/report.types";
import { buildReportsQueryVariables } from "./buildReportsQueryVariables";

export async function fetchAllReports(
  limit: number,
  filters: ReportFilters
): Promise<Report[]> {
  return fetchAllPaginated<
    AdminReportsQuery,
    ReturnType<typeof buildReportsQueryVariables>,
    Report
  >(limit, {
    query: AdminReportsDocument,
    buildVariables: (page, pageLimit) =>
      buildReportsQueryVariables(page, pageLimit, filters),
    extractPage: (data) => {
      const result = data.adminReports;
      if (!result) {
        return null;
      }
      return {
        items: result.items ?? [],
        hasNextPage: result.hasNextPage,
      };
    },
  });
}
