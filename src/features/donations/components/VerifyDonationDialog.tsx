import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DONATION_ACTION_LABELS,
  DONATION_VERIFY_DIALOG,
} from "@/constants/donations.constants";
import type { Donation } from "@/types/donation.types";

type VerifyDonationDialogProps = {
  donation: Donation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (donationId: string) => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
};

export function VerifyDonationDialog({
  donation,
  open,
  onOpenChange,
  onConfirm,
  loading,
  errorMessage,
}: VerifyDonationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{DONATION_VERIFY_DIALOG.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {DONATION_VERIFY_DIALOG.irreversibleWarning}{" "}
            <span className="font-semibold text-foreground">
              {donation?.title ?? donation?.id}
            </span>
            {donation?.id ? (
              <span className="mt-1 block font-mono text-xs text-muted-foreground">
                {donation.id}
              </span>
            ) : null}
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
            {DONATION_ACTION_LABELS.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => donation && onConfirm(donation.id)}
            disabled={loading}
            className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold shadow-card"
          >
            {loading ? DONATION_ACTION_LABELS.verifying : DONATION_ACTION_LABELS.confirmVerify}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
