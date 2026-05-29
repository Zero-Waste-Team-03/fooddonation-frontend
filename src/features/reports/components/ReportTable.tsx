import { ReportTargetType } from "@/gql/graphql";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  reportStatusBadgeVariant,
  reportStatusLabels,
  reportTargetTypeLabels,
  REPORT_TABLE_LABELS,
  ReportAction,
} from "@/constants/reports.constants";
import type { Report } from "@/types/report.types";
import { cn } from "@/lib/utils";
import { ReportActionButtons } from "./ReportActionButtons";
import { ReportUserInfoCell } from "./ReportUserInfoCell";

type ReportTableProps = {
  reports: Report[];
  loading: boolean;
  actionsLoading: boolean;
  onRowClick?: (report: Report) => void;
  onReportAction: (report: Report, action: ReportAction) => void;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function isNavigableReport(report: Report): boolean {
  return (
    report.targetType === ReportTargetType.User ||
    report.targetType === ReportTargetType.Donation
  );
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="px-6 py-4">
        <Skeleton className="h-6 w-20 rounded-full bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-48 bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-11 w-48 bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-6 w-24 rounded-full bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-28 bg-muted" />
      </TableCell>
      <TableCell className="px-6 py-4">
        <div className="flex justify-end gap-1">
          <Skeleton className="h-8 w-8 rounded-full bg-muted" />
          <Skeleton className="h-8 w-8 rounded-full bg-muted" />
          <Skeleton className="h-8 w-8 rounded-full bg-muted" />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function ReportTable({
  reports,
  loading,
  actionsLoading,
  onRowClick,
  onReportAction,
}: ReportTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <Table>
        <caption className="sr-only">{REPORT_TABLE_LABELS.caption}</caption>
        <TableHeader>
          <TableRow className="border-b border-border/50 bg-transparent hover:bg-transparent">
            <TableHead className="px-6 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {REPORT_TABLE_LABELS.targetType}
            </TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {REPORT_TABLE_LABELS.target}
            </TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {REPORT_TABLE_LABELS.reporter}
            </TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {REPORT_TABLE_LABELS.status}
            </TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {REPORT_TABLE_LABELS.created}
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {REPORT_TABLE_LABELS.actions}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => <TableRowSkeleton key={index} />)
          ) : reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="p-6 text-center text-muted-foreground">
                {REPORT_TABLE_LABELS.empty}
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => {
              const navigable = isNavigableReport(report);
              const isUserTarget = report.targetType === ReportTargetType.User;

              return (
                <TableRow
                  key={report.id}
                  className={cn(
                    "border-b border-border/50 hover:bg-muted/30",
                    navigable && "cursor-pointer"
                  )}
                  onClick={() => navigable && onRowClick?.(report)}
                >
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline">{reportTargetTypeLabels[report.targetType]}</Badge>
                  </TableCell>
                  <TableCell className="py-4 text-sm">
                    {isUserTarget ? (
                      <ReportUserInfoCell
                        userId={report.targetId}
                        fallbackId={report.targetId}
                        navigable={navigable}
                      />
                    ) : (
                      <span
                        className={cn(
                          navigable
                            ? "font-medium text-primary underline-offset-4 hover:underline"
                            : "font-mono text-xs text-muted-foreground"
                        )}
                      >
                        {report.targetId}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-4 text-sm">
                    <ReportUserInfoCell
                      userId={report.reporterId}
                      fallbackId={report.reporterId}
                      partialUser={report.reporter}
                    />
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant={reportStatusBadgeVariant(report.status)}>
                      {reportStatusLabels[report.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-muted-foreground">
                    {formatDate(report.createdAt)}
                  </TableCell>
                  <TableCell className="px-6 py-4" onClick={(event) => event.stopPropagation()}>
                    <ReportActionButtons
                      report={report}
                      loading={actionsLoading}
                      onReportAction={onReportAction}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
