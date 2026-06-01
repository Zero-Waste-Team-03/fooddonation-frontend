import type { Report, ReportFilters } from "@/types/report.types";

function normalize(value: string | null | undefined): string {
  return (value ?? "").toLowerCase();
}

export function matchesReportSearchFilter(report: Report, search: ReportFilters["search"]): boolean {
  const q = search.trim().toLowerCase();
  if (!q) {
    return true;
  }

  const searchableFields = [
    report.id,
    report.reason,
    report.reporterId,
    report.reporter?.displayName ?? "",
    report.reporter?.email ?? "",
    report.targetId,
    report.targetType,
    report.status,
    report.description ?? "",
  ];

  return searchableFields.some((field) => normalize(field).includes(q));
}

export function filterReportsBySearch(reports: Report[], search: ReportFilters["search"]): Report[] {
  const q = search.trim();
  if (!q) {
    return reports;
  }
  return reports.filter((report) => matchesReportSearchFilter(report, search));
}
