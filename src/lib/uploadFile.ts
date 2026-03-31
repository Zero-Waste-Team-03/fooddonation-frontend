import { axiosClient } from "./axiosClient";

export type UploadFileResponse = {
  success: boolean;
  timeStamp: string;
  data: {
    attachmentId: string;
    jobId: string;
  };
};

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post<UploadFileResponse>(
    "/api/v1/upload/file/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (!response.data.success) {
    throw new Error("File upload failed");
  }

  return response.data.data.attachmentId;
}
