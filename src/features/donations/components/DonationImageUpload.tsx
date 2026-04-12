import { useEffect, useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { uploadFile } from "@/lib/uploadFile";

type DonationImageUploadProps = {
  onUploadComplete: (attachmentId: string) => void;
  onUploadError: (message: string) => void;
  currentAttachmentId?: string | null;
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export function DonationImageUpload({
  onUploadComplete,
  onUploadError,
  currentAttachmentId,
}: DonationImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return "File must be smaller than 5MB.";
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only JPEG, PNG, and WebP images are supported.";
    }

    return null;
  };

  const handleUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      onUploadError(validationError);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
    setErrorMessage(null);
    setIsUploading(true);

    try {
      const attachmentId = await uploadFile(file, "POST");
      onUploadComplete(attachmentId);
    } catch {
      const message = "Image upload failed. Please try again.";
      setErrorMessage(message);
      onUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const openFilePicker = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      void handleUpload(file);
    }
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      void handleUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={[
          "relative flex h-40 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 transition-colors",
          isDragging ? "border-primary" : "border-border",
          isUploading ? "pointer-events-none" : "",
        ].join(" ")}
        onClick={openFilePicker}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFilePicker();
          }
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Donation preview"
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-6 w-6" />
            <span className="text-sm">Click or drag to upload an image</span>
          </div>
        )}

        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/60">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFileInputChange}
      />

      {currentAttachmentId ? (
        <p className="text-xs text-muted-foreground">
          Attachment ID: {currentAttachmentId}
        </p>
      ) : null}

      {errorMessage ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
