import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  ADMIN_EXPORT_DOWNLOAD_NAMES,
  AdminExportDataset,
  EXPORT_API_PATH_CSV,
  EXPORT_API_PATH_PDF,
  EXPORT_LABELS,
  EXPORT_MIME_TYPES,
  EXPORT_QUERY_PARAM_DATASET,
  ExportFileType,
} from "@/constants/export.constants";
import { authStorage } from "@/lib/authStorage";
import { downloadBlob } from "@/lib/downloadBlob";

function getExportPath(fileType: ExportFileType): string {
  return fileType === ExportFileType.Pdf ? EXPORT_API_PATH_PDF : EXPORT_API_PATH_CSV;
}

function getMimeType(fileType: ExportFileType): string {
  return fileType === ExportFileType.Pdf ? EXPORT_MIME_TYPES.pdf : EXPORT_MIME_TYPES.csv;
}

export function useAdminExport() {
  const [loading, setLoading] = useState(false);

  const downloadExport = useCallback(
    async (fileType: ExportFileType, dataset: AdminExportDataset): Promise<boolean> => {
      const token = authStorage.getAccessToken();
      if (!token) {
        toast.error(EXPORT_LABELS.exportFailed);
        return false;
      }

      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_REST_URL;
        const path = getExportPath(fileType);
        const url = new URL(path, baseUrl);
        url.searchParams.set(EXPORT_QUERY_PARAM_DATASET, dataset);

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.trim()}`,
          },
        });

        if (!response.ok) {
          throw new Error(EXPORT_LABELS.exportFailed);
        }

        const rawBlob = await response.blob();
        const blob = new Blob([rawBlob], { type: getMimeType(fileType) });
        const fileName = ADMIN_EXPORT_DOWNLOAD_NAMES[dataset][fileType];
        downloadBlob(blob, fileName);
        return true;
      } catch {
        toast.error(EXPORT_LABELS.exportFailed);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    downloadExport,
  };
}
