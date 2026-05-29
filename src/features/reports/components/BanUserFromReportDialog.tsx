import { useFragment } from "@apollo/client/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { REPORT_BAN_DIALOG_LABELS } from "@/constants/reports.constants";
import {
  UserAdminListFieldsFragmentDoc,
  type UserAdminListFieldsFragment,
} from "@/gql/graphql";
import type { Report } from "@/types/report.types";

type BanUserFromReportDialogProps = {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (report: Report) => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
};

function BanUserTargetLabel({ report }: { report: Report }) {
  const { data, complete } = useFragment<UserAdminListFieldsFragment>({
    fragment: UserAdminListFieldsFragmentDoc,
    fragmentName: "UserAdminListFields",
    from: {
      __typename: "User",
      id: report.targetId,
    },
  });

  if (complete) {
    return <span className="font-semibold text-foreground">{data.displayName ?? data.email}</span>;
  }

  return <span className="font-semibold text-foreground">{report.targetId}</span>;
}

export function BanUserFromReportDialog({
  report,
  open,
  onOpenChange,
  onConfirm,
  loading,
  errorMessage,
}: BanUserFromReportDialogProps) {

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{REPORT_BAN_DIALOG_LABELS.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {REPORT_BAN_DIALOG_LABELS.descriptionPrefix}{" "}
            {report ? <BanUserTargetLabel report={report} /> : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {errorMessage ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {errorMessage}
          </div>
        ) : null}
        <div className="flex justify-end gap-3">
          <AlertDialogCancel
            disabled={loading}
            className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold"
          >
            {REPORT_BAN_DIALOG_LABELS.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => report && onConfirm(report)}
            disabled={loading || !report}
            className="h-11 min-h-11 rounded-xl bg-destructive px-6 text-sm font-semibold text-destructive-foreground shadow-card hover:bg-destructive/90"
          >
            {loading ? REPORT_BAN_DIALOG_LABELS.confirming : REPORT_BAN_DIALOG_LABELS.confirm}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
