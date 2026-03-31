export type AttachmentUploadStatus = "COMPLETED" | "FAILED" | "PENDING" | "UPLOADING";

export type Attachment = {
  createdAt: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  id: string;
  jobId?: string | null;
  updatedAt: string;
  uploadStatus?: AttachmentUploadStatus | null;
  uploadedById: string;
  url?: string | null;
};