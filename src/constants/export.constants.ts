export const EXPORT_LABELS = {
  exportButton: "Export",
  listDialogTitle: "Export data",
  exportCurrentPage: "Export current page",
  exportEntireList: "Export entire list",
  cancel: "Cancel",
  loading: "Preparing export…",
  exportFailed: "Export failed. Please try again.",
  exportData: "Export Data",
  globalDialogTitle: "Export data",
  fileType: "File type",
  dataType: "Data type",
  fileTypePdf: "PDF",
  fileTypeCsv: "CSV",
  datasetReports: "Reports",
  datasetDangerousDonations: "Dangerous Donations",
  confirm: "Download",
  selectFileType: "Select file type",
  selectDataType: "Select data type",
} as const;

export const EXPORT_FILE_NAMES = {
  users: "users.csv",
  donations: "donations.csv",
  reports: "reports.csv",
} as const;

export const EXPORT_API_PATH_PDF = "/api/v1/admin/exports/pdf";
export const EXPORT_API_PATH_CSV = "/api/v1/admin/exports/csv";

export const EXPORT_QUERY_PARAM_DATASET = "dataset";

export const EXPORT_MIME_TYPES = {
  pdf: "application/pdf",
  csv: "text/csv",
} as const;

export enum ExportFileType {
  Pdf = "pdf",
  Csv = "csv",
}

export enum AdminExportDataset {
  Reports = "reports",
  DangerousDonations = "dangerous-donations",
}

export const ADMIN_EXPORT_DOWNLOAD_NAMES: Record<
  AdminExportDataset,
  Record<ExportFileType, string>
> = {
  [AdminExportDataset.Reports]: {
    [ExportFileType.Pdf]: "reports.pdf",
    [ExportFileType.Csv]: "reports.csv",
  },
  [AdminExportDataset.DangerousDonations]: {
    [ExportFileType.Pdf]: "dangerous-donations.pdf",
    [ExportFileType.Csv]: "dangerous-donations.csv",
  },
};
