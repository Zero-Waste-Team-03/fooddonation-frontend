import type {
  Report as GeneratedReport,
  ReportStats as GeneratedReportStats,
  ReportStatus,
  ReportTargetType,
  StatsGrowthPoint as GeneratedGrowthDataPoint,
} from "@/gql/graphql";

export type { GeneratedReportStats as ReportStats };
export type { GeneratedReport as Report };
export type { GeneratedGrowthDataPoint as GrowthDataPoint };

export type ReportPeriod = "LAST_MONTH" | "LAST_WEEK" | "LAST_YEAR";

export type ReportFilters = {
  search: string;
  status: ReportStatus | null;
  type: ReportTargetType | null;
};
