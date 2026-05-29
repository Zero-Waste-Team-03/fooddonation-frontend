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
  actions: "Actions",
  empty: "No reports found",
  caption: "Reports list with target type, target, reporter, status, and actions",
} as const;

export enum ReportAction {
  MarkUnderReview = "markUnderReview",
  MarkOpen = "markOpen",
  Resolve = "resolve",
  Reject = "reject",
  BanUser = "banUser",
}

export const REPORT_ACTION_LABELS: Record<ReportAction, string> = {
  [ReportAction.MarkUnderReview]: "Mark as under review",
  [ReportAction.MarkOpen]: "Mark as open",
  [ReportAction.Resolve]: "Mark as resolved",
  [ReportAction.Reject]: "Mark as rejected",
  [ReportAction.BanUser]: "Ban user",
};

export const REPORT_BAN_DIALOG_LABELS = {
  title: "Ban user and resolve report",
  descriptionPrefix:
    "This will suspend the reported user and mark the report as resolved. The user will not be able to log in or access services:",
  cancel: "Cancel",
  confirm: "Ban user",
  confirming: "Banning user...",
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

export function getVisibleReportActions(
  status: ReportStatus,
  targetType: ReportTargetType
): ReportAction[] {
  if (status === ReportStatus.Resolved || status === ReportStatus.Rejected) {
    return [];
  }

  const actions: ReportAction[] = [];

  if (status === ReportStatus.Open) {
    actions.push(ReportAction.MarkUnderReview);
  }

  if (status === ReportStatus.UnderReview) {
    actions.push(ReportAction.MarkOpen);
  }

  if (status === ReportStatus.Open || status === ReportStatus.UnderReview) {
    if (targetType === ReportTargetType.User) {
      actions.push(ReportAction.BanUser);
    } else {
      actions.push(ReportAction.Resolve);
    }
    actions.push(ReportAction.Reject);
  }

  return actions;
}

export function reportActionToStatus(action: ReportAction): ReportStatus | null {
  if (action === ReportAction.MarkUnderReview) {
    return ReportStatus.UnderReview;
  }
  if (action === ReportAction.MarkOpen) {
    return ReportStatus.Open;
  }
  if (action === ReportAction.Resolve) {
    return ReportStatus.Resolved;
  }
  if (action === ReportAction.Reject) {
    return ReportStatus.Rejected;
  }
  return null;
}
