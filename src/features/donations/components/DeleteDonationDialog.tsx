import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Donation } from "@/types/donation.types";

type DeleteDonationDialogProps = {
  donation: Donation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (donationId: string) => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
};

export function DeleteDonationDialog({
  donation,
  open,
  onOpenChange,
  onConfirm,
  loading,
  errorMessage,
}: DeleteDonationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete donation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {donation?.title ?? "this donation"}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {errorMessage && (
          <div
            role="alert"
            className="px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive"
          >
            {errorMessage}
          </div>
        )}
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel
            disabled={loading}
            className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => donation && onConfirm(donation.id)}
            disabled={loading}
            className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold shadow-card bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
