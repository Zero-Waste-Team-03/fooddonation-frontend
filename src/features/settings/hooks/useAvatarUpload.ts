import { useState } from "react";
import { uploadFile } from "@/lib/uploadFile";
import { useUpdateProfileMutation, CurrentUserDocument } from "@/gql/graphql";

export type AvatarUploadState =
  | "idle"
  | "uploading"
  | "updating"
  | "success"
  | "error";

export function useAvatarUpload() {
  const [state, setState] = useState<AvatarUploadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [updateProfile] = useUpdateProfileMutation({
    refetchQueries: [CurrentUserDocument],
  });

  const handleAvatarUpload = async (file: File) => {
    setState("uploading");
    setErrorMessage(null);

    try {
      const attachmentId = await uploadFile(file);

      setState("updating");

      const result = await updateProfile({
        variables: {
          updateProfileInput: {
            avatarAttachmentId: attachmentId,
          },
        },
      });

      if (!result.data?.updateProfile) {
        throw new Error("Profile update failed after upload");
      }

      setState("success");

      setTimeout(() => setState("idle"), 2000);
    } catch (err) {
      setState("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Avatar upload failed. Please try again."
      );
    }
  };

  const reset = () => {
    setState("idle");
    setErrorMessage(null);
  };

  return {
    handleAvatarUpload,
    state,
    errorMessage,
    reset,
    isLoading: state === "uploading" || state === "updating",
  };
}
