import { ReportStatus, ReportTargetType } from "@/gql/graphql";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllowedReportStatusTransitions,
  reportStatusBadgeVariant,
  reportStatusLabels,
  reportTargetTypeLabels,
  REPORT_TABLE_LABELS,
} from "@/constants/reports.constants";
import type { Report } from "@/types/report.types";
import { cn } from "@/lib/utils";

type ReportTableProps = {
  reports: Report[];
  loading: boolean;
  statusUpdating: boolean;
  onRowClick?: (report: Report) => void;
  onStatusChange?: (reportId: string, status: ReportStatus) => void;
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

function getReporterLabel(report: Report): string {
  return report.reporter?.displayName ?? report.reporter?.email ?? report.reporterId;
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
        <Skeleton className="h-4 w-32 bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-6 w-24 rounded-full bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-28 bg-muted" />
      </TableCell>
      <TableCell className="px-6 py-4">
        <Skeleton className="h-10 w-36 bg-muted" />
      </TableCell>
    </TableRow>
  );
}

type ReportStatusSelectProps = {
  report: Report;
  disabled: boolean;
  onStatusChange?: (reportId: string, status: ReportStatus) => void;
};

function ReportStatusSelect({ report, disabled, onStatusChange }: ReportStatusSelectProps) {
  const transitions = getAllowedReportStatusTransitions(report.status);

  return (
    <Select
      disabled={disabled || transitions.length === 0}
      onValueChange={(value) => onStatusChange?.(report.id, value as ReportStatus)}
    >
      <SelectTrigger
        className="h-10 w-full min-w-[10rem] sm:w-40"
        aria-label={REPORT_TABLE_LABELS.changeStatus}
        onClick={(event) => event.stopPropagation()}
      >
        <SelectValue placeholder={reportStatusLabels[report.status]} />
      </SelectTrigger>
      <SelectContent>
        {transitions.map((status) => (
          <SelectItem key={status} value={status}>
            {reportStatusLabels[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ReportTable({
  reports,
  loading,
  statusUpdating,
  onRowClick,
  onStatusChange,
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
              {REPORT_TABLE_LABELS.statusAction}
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
                    <span
                      className={cn(
                        navigable
                          ? "font-medium text-primary underline-offset-4 hover:underline"
                          : "font-mono text-xs text-muted-foreground"
                      )}
                    >
                      {report.targetId}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-sm font-medium text-foreground">
                    {getReporterLabel(report)}
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
                    <ReportStatusSelect
                      report={report}
                      disabled={statusUpdating}
                      onStatusChange={onStatusChange}
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
