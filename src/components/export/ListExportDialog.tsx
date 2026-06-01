import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EXPORT_LABELS } from "@/constants/export.constants";

type ListExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  loading: boolean;
  errorMessage?: string | null;
  onExportCurrentPage: () => void;
  onExportEntireList: () => void;
};

const actionButtonClassName =
  "h-14 min-h-14 flex-1 rounded-xl px-4 text-sm font-semibold sm:text-base";

export function ListExportDialog({
  open,
  onOpenChange,
  title,
  loading,
  errorMessage,
  onExportCurrentPage,
  onExportEntireList,
}: ListExportDialogProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (loading) {
      return;
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              <span>{EXPORT_LABELS.loading}</span>
            </div>
          ) : null}

          {errorMessage ? (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              className={actionButtonClassName}
              disabled={loading}
              onClick={onExportCurrentPage}
            >
              {EXPORT_LABELS.exportCurrentPage}
            </Button>
            <Button
              type="button"
              variant="outline"
              className={actionButtonClassName}
              disabled={loading}
              onClick={onExportEntireList}
            >
              {EXPORT_LABELS.exportEntireList}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold"
            disabled={loading}
            onClick={() => handleOpenChange(false)}
          >
            {EXPORT_LABELS.cancel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
