import { ReportStatus, ReportTargetType } from "@/gql/graphql";

export const REPORT_FILTER_LABELS = {
  allStatuses: "All Statuses",
  allTypes: "All Types",
  clear: "Clear",
  searchPlaceholder: "Search by reporter or target...",
  selectStatus: "Select status",
  selectType: "Select type",
  showing: "Showing",
  of: "of",
  reports: "reports",
} as const;

export const REPORT_TABLE_LABELS = {
  targetType: "Target type",
  target: "Target",
  reporter: "Reporter",
  status: "Status",
  created: "Created",
  statusAction: "Status",
  empty: "No reports found",
  caption: "Reports list with target type, target, reporter, status, and actions",
  changeStatus: "Change report status",
} as const;

export const REPORT_STATUS_OPTIONS: ReportStatus[] = [
  ReportStatus.Open,
  ReportStatus.UnderReview,
  ReportStatus.Resolved,
  ReportStatus.Rejected,
];

export const REPORT_TARGET_TYPE_OPTIONS: ReportTargetType[] = [
  ReportTargetType.Donation,
  ReportTargetType.Message,
  ReportTargetType.User,
];

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}

export const reportStatusLabels: Record<ReportStatus, string> = {
  [ReportStatus.Open]: formatEnumLabel(ReportStatus.Open),
  [ReportStatus.UnderReview]: formatEnumLabel(ReportStatus.UnderReview),
  [ReportStatus.Resolved]: formatEnumLabel(ReportStatus.Resolved),
  [ReportStatus.Rejected]: formatEnumLabel(ReportStatus.Rejected),
};

export const reportTargetTypeLabels: Record<ReportTargetType, string> = {
  [ReportTargetType.Donation]: formatEnumLabel(ReportTargetType.Donation),
  [ReportTargetType.Message]: formatEnumLabel(ReportTargetType.Message),
  [ReportTargetType.User]: formatEnumLabel(ReportTargetType.User),
};

export function reportStatusBadgeVariant(
  status: ReportStatus
): "warning" | "success" | "secondary" | "info" {
  if (status === ReportStatus.Open) {
    return "warning";
  }

  if (status === ReportStatus.Resolved) {
    return "success";
  }

  if (status === ReportStatus.Rejected) {
    return "secondary";
  }

  return "info";
}

export function getAllowedReportStatusTransitions(
  currentStatus: ReportStatus
): ReportStatus[] {
  if (currentStatus === ReportStatus.Open) {
    return [
      ReportStatus.UnderReview,
      ReportStatus.Resolved,
      ReportStatus.Rejected,
    ];
  }

  if (currentStatus === ReportStatus.UnderReview) {
    return [ReportStatus.Open, ReportStatus.Resolved, ReportStatus.Rejected];
  }

  return [];
}
