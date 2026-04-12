import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { ReportStatus } from "@/gql/graphql";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Report } from "@/types/report.types";

type ReportTableProps = {
  reports: Report[];
  loading: boolean;
  onAction?: (reportId: string, action: string) => void;
};

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getStatusBadgeVariant(
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

function useLongPress(onLongPress: () => void, delay = 450) {
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      onLongPress();
      timerRef.current = null;
    }, delay);
  };

  useEffect(() => clearTimer, []);

  return {
    onTouchStart: startTimer,
    onTouchEnd: clearTimer,
    onTouchCancel: clearTimer,
    onMouseDown: startTimer,
    onMouseUp: clearTimer,
    onMouseLeave: clearTimer,
  };
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="px-6 py-4">
        <Skeleton className="h-4 w-32 bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-48 bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-6 w-20 rounded-full bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-6 w-24 rounded-full bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-28 bg-muted" />
      </TableCell>
      <TableCell className="px-6 py-4 text-right">
        <Skeleton className="ml-auto h-8 w-8 rounded-full bg-muted" />
      </TableCell>
    </TableRow>
  );
}

type ReportActionsMenuProps = {
  report: Report;
  onAction?: (reportId: string, action: string) => void;
};

function ReportActionsMenu({ report, onAction }: ReportActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const longPressHandlers = useLongPress(() => setOpen(true));

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={`Open actions for report ${report.id}`}
          {...longPressHandlers}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onAction?.(report.id, "view")}>View detail</DropdownMenuItem>
        {report.status !== ReportStatus.Resolved && (
          <DropdownMenuItem
            onClick={() => onAction?.(report.id, "resolve")}
            className="text-success focus:bg-success/10 focus:text-success"
          >
            Resolve
          </DropdownMenuItem>
        )}
        {report.status !== ReportStatus.Rejected && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onAction?.(report.id, "dismiss")}
              className="text-muted-foreground"
            >
              Dismiss
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ReportTable({ reports, loading, onAction }: ReportTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <Table>
        <caption className="sr-only">
          Reports list with reporter, target, type, status, creation date, and actions
        </caption>
        <TableHeader>
          <TableRow className="border-b border-border/50 bg-transparent hover:bg-transparent">
            <TableHead className="w-1/5 px-6 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Reporter
            </TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Target
            </TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Type
            </TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Status
            </TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Created
            </TableHead>
            <TableHead className="px-6 py-4 text-right text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
          ) : reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="p-6 text-center text-muted-foreground">
                No reports found
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => (
              <TableRow key={report.id} className="border-b border-border/50 hover:bg-muted/30">
                <TableCell className="px-6 py-4 text-sm font-medium text-foreground">
                  {report.reporterId}
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-foreground">{formatEnumLabel(report.targetType)}</span>
                    <span className="font-mono text-xs text-muted-foreground">{report.targetId}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline">{formatEnumLabel(report.targetType)}</Badge>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant={getStatusBadgeVariant(report.status)}>
                    {formatEnumLabel(report.status)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {formatDate(report.createdAt)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <ReportActionsMenu report={report} onAction={onAction} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
