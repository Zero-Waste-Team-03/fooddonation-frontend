import { useRef, useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import { useAvatarUpload } from "../hooks/useAvatarUpload";

type AvatarUploadProps = {
  currentAvatarUrl?: string | null;
  displayName?: string | null;
  email: string;
};

export function AvatarUpload({
  currentAvatarUrl,
  displayName,
  email,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const { handleAvatarUpload, state, errorMessage, isLoading } =
    useAvatarUpload();

  const circleSize = "96px";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setLocalError("File must be smaller than 5MB.");
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setLocalError("Only JPEG, PNG, and WebP images are supported.");
      return;
    }

    setLocalError(null);
    handleAvatarUpload(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative group cursor-pointer"
        style={{ width: circleSize, height: circleSize }}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!isLoading) fileInputRef.current?.click();
          }
        }}
        aria-label="Change avatar"
        aria-disabled={isLoading}
      >
        <div className="w-full h-full rounded-full overflow-hidden">
          {currentAvatarUrl ? (
            <img
              src={currentAvatarUrl}
              alt={displayName ?? email}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{
                background:
                  "color-mix(in srgb, var(--color-primary) 15%, transparent)",
              }}
            >
              <span
                className="text-2xl font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                {(displayName?.[0] || email?.[0] || "U").toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          {!isLoading && state !== "success" && (
            <Upload className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>

        {isLoading && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}

        {state === "success" && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleFileChange}
          aria-label="Upload avatar"
        />
      </div>

      <p className="text-xs text-muted-foreground mt-2 text-center">
        {isLoading
          ? state === "uploading"
            ? "Uploading..."
            : "Saving..."
          : "Click to change avatar"}
      </p>

      {(errorMessage || localError) && (
        <p role="alert" className="text-xs text-destructive mt-1 text-center">
          {localError ?? errorMessage}
        </p>
      )}
    </div>
  );
}
