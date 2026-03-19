export type ReportStatus = "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";

export type ReportReason = "DANGEROUS_FOOD" | "BAD_BEHAVIOR" | "SPAM" | "OTHER";

export type Report = {
  id: string;
  reason: ReportReason;
  status: ReportStatus;
  reporterId: string;
  targetId: string;
  createdAt: string;
};
