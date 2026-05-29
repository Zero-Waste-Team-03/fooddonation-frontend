import { Ban, CheckCircle2, Eye, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getVisibleReportActions,
  REPORT_ACTION_LABELS,
  ReportAction,
} from "@/constants/reports.constants";
import type { Report } from "@/types/report.types";

type ReportActionButtonsProps = {
  report: Report;
  loading: boolean;
  onReportAction: (report: Report, action: ReportAction) => void;
};

const REPORT_ACTION_ICONS: Record<ReportAction, typeof Eye> = {
  [ReportAction.MarkUnderReview]: Eye,
  [ReportAction.MarkOpen]: RotateCcw,
  [ReportAction.Resolve]: CheckCircle2,
  [ReportAction.Reject]: XCircle,
  [ReportAction.BanUser]: Ban,
};

export function ReportActionButtons({
  report,
  loading,
  onReportAction,
}: ReportActionButtonsProps) {
  const visibleActions = getVisibleReportActions(report.status, report.targetType);

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center justify-end gap-1">
        {visibleActions.map((action) => {
          const Icon = REPORT_ACTION_ICONS[action];
          const isDestructive =
            action === ReportAction.Reject || action === ReportAction.BanUser;

          return (
            <Tooltip key={action}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={loading}
                  aria-label={REPORT_ACTION_LABELS[action]}
                  className={
                    isDestructive
                      ? "h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                      : "h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    onReportAction(report, action);
                  }}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{REPORT_ACTION_LABELS[action]}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
