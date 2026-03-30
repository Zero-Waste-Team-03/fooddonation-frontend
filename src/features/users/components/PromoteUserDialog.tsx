import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { User } from "@/types/user.types";

type ActivateUserDialogProps = {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string) => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
};

export function PromoteUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  loading,
  errorMessage,
}: ActivateUserDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Activate User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to activate{" "}
            <span className="font-semibold text-foreground">
              {user?.displayName || user?.email}
            </span>
            ? They will regain access to services.
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
            onClick={() => user && onConfirm(user.id)}
            disabled={loading}
            className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold shadow-card"
          >
            {loading ? "Activating..." : "Activate"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
