import type { ReportFilters } from "@/types/report.types";

export function buildReportsQueryVariables(
  page: number,
  limit: number,
  filters: ReportFilters
) {
  return {
    page,
    limit,
    status: filters.status ?? undefined,
    targetType: filters.type ?? undefined,
  };
}
