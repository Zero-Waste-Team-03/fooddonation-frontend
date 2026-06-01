import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdminExportDataset,
  EXPORT_LABELS,
  ExportFileType,
} from "@/constants/export.constants";
import { useAdminExport } from "@/features/export/hooks/useAdminExport";

type GlobalExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const fileTypeOptions = [
  { value: ExportFileType.Pdf, label: EXPORT_LABELS.fileTypePdf },
  { value: ExportFileType.Csv, label: EXPORT_LABELS.fileTypeCsv },
] as const;

const datasetOptions = [
  { value: AdminExportDataset.Reports, label: EXPORT_LABELS.datasetReports },
  {
    value: AdminExportDataset.DangerousDonations,
    label: EXPORT_LABELS.datasetDangerousDonations,
  },
] as const;

export function GlobalExportDialog({ open, onOpenChange }: GlobalExportDialogProps) {
  const { loading, downloadExport } = useAdminExport();
  const [fileType, setFileType] = useState<ExportFileType>(ExportFileType.Pdf);
  const [dataset, setDataset] = useState<AdminExportDataset>(AdminExportDataset.Reports);

  const handleOpenChange = (nextOpen: boolean) => {
    if (loading) {
      return;
    }
    onOpenChange(nextOpen);
  };

  const handleConfirm = async () => {
    const success = await downloadExport(fileType, dataset);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {EXPORT_LABELS.globalDialogTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="export-file-type">{EXPORT_LABELS.fileType}</Label>
            <Select
              value={fileType}
              onValueChange={(value) => setFileType(value as ExportFileType)}
              disabled={loading}
            >
              <SelectTrigger id="export-file-type" className="h-11 rounded-xl">
                <SelectValue placeholder={EXPORT_LABELS.selectFileType} />
              </SelectTrigger>
              <SelectContent>
                {fileTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="export-data-type">{EXPORT_LABELS.dataType}</Label>
            <Select
              value={dataset}
              onValueChange={(value) => setDataset(value as AdminExportDataset)}
              disabled={loading}
            >
              <SelectTrigger id="export-data-type" className="h-11 rounded-xl">
                <SelectValue placeholder={EXPORT_LABELS.selectDataType} />
              </SelectTrigger>
              <SelectContent>
                {datasetOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold"
            disabled={loading}
            onClick={() => handleOpenChange(false)}
          >
            {EXPORT_LABELS.cancel}
          </Button>
          <Button
            type="button"
            className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold shadow-card"
            disabled={loading}
            onClick={() => void handleConfirm()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                {EXPORT_LABELS.loading}
              </>
            ) : (
              EXPORT_LABELS.confirm
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
