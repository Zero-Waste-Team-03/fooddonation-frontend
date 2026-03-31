import { useState } from "react";
import { AppearanceTheme, CurrentUserDocument, useUpdateSettingsMutation } from "@/gql/graphql";
import { parseUserActionError, type UserActionErrorMessage } from "@/features/users/utils/parseUserActionError";
import type { UpdateProfileFormValues } from "@/types/user.types";

export function useUpdateSettings() {
  const [errorMessage, setErrorMessage] = useState<UserActionErrorMessage | null>(null);
  const [success, setSuccess] = useState(false);

  const [updateSettings, { loading }] = useUpdateSettingsMutation({
    refetchQueries: [CurrentUserDocument],
    onError: (err: unknown) => setErrorMessage(parseUserActionError(err)),
  });

  const handleUpdate = async (values: UpdateProfileFormValues) => {
    setErrorMessage(null);
    setSuccess(false);

    const result = await updateSettings({
      variables: {
        updateProfileInput: {
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
