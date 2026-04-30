import type {
  AdminReportsQuery,
  ReportStats as GeneratedReportStats,
  ReportStatus,
  ReportTargetType,
  StatsGrowthPoint as GeneratedGrowthDataPoint,
} from "@/gql/graphql";

export type { GeneratedReportStats as ReportStats };
export type Report = NonNullable<
  NonNullable<AdminReportsQuery["adminReports"]["items"]>[number]
>;
export type { GeneratedGrowthDataPoint as GrowthDataPoint };

export type ReportPeriod = "LAST_MONTH" | "LAST_WEEK" | "LAST_YEAR";

export type ReportFilters = {
  search: string;
  status: ReportStatus | null;
  type: ReportTargetType | null;
};
