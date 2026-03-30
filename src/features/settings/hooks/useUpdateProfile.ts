import { useState } from "react";
import { AppearanceTheme, CurrentUserDocument, useUpdateProfileMutation } from "@/gql/graphql";
import { parseUserActionError, type UserActionErrorMessage } from "@/features/users/utils/parseUserActionError";
import type { UpdateProfileFormValues } from "@/types/user.types";

export function useUpdateProfile() {
  const [errorMessage, setErrorMessage] = useState<UserActionErrorMessage | null>(null);
  const [success, setSuccess] = useState(false);

  const [updateProfile, { loading }] = useUpdateProfileMutation({
    refetchQueries: [CurrentUserDocument],
    onError: (err: unknown) => setErrorMessage(parseUserActionError(err)),
  });

  const handleUpdate = async (values: UpdateProfileFormValues) => {
    setErrorMessage(null);
    setSuccess(false);

    const result = await updateProfile({
      variables: {
        updateProfileInput: {
          displayName: values.displayName,
          email: values.email,
          location: {
            city: values.location.city || null,
            country: values.location.country || null,
            latitude: values.location.latitude ?? null,
            longitude: values.location.longitude ?? null,
            neighborhood: values.location.neighborhood || null,
          },
          settings: {
            appearance: AppearanceTheme[values.settings.appearance as keyof typeof AppearanceTheme],
            isNewDonationsAlertsEnabled: values.settings.isNewDonationsAlertsEnabled,
            isSystemReports: values.settings.isSystemReports,
            isUrgentAlertsEnabled: values.settings.isUrgentAlertsEnabled,
          },
        },
      },
    });

    if (result.data?.updateProfile) {
      setSuccess(true);
    }
  };

  const clearState = () => {
    setSuccess(false);
    setErrorMessage(null);
  };

  return {
    handleUpdate,
    loading,
    errorMessage,
    success,
    clearState,
  };
}
