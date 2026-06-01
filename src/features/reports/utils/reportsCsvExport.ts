import {
  REPORT_TABLE_LABELS,
  reportStatusLabels,
  reportTargetTypeLabels,
} from "@/constants/reports.constants";
import type { Report } from "@/types/report.types";

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", dateFormatOptions).format(date);
}

function formatUserCell(
  displayName: string | null | undefined,
  email: string | null | undefined,
  fallbackId: string
): string {
  if (email) {
    const name = displayName ?? "—";
    return `${name} (${email})`;
  }
  return fallbackId;
}

function formatTargetCell(report: Report): string {
  return report.targetId;
}

function formatReporterCell(report: Report): string {
  return formatUserCell(
    report.reporter?.displayName,
    report.reporter?.email,
    report.reporterId
  );
}

export function getReportsCsvHeaders(): string[] {
  return [
    REPORT_TABLE_LABELS.targetType,
    REPORT_TABLE_LABELS.target,
    REPORT_TABLE_LABELS.reporter,
    REPORT_TABLE_LABELS.status,
    REPORT_TABLE_LABELS.created,
  ];
}

export function mapReportsToCsvRows(reports: Report[]): string[][] {
  return reports.map((report) => [
    reportTargetTypeLabels[report.targetType],
    formatTargetCell(report),
    formatReporterCell(report),
    reportStatusLabels[report.status],
    formatDate(report.createdAt),
  ]);
}
