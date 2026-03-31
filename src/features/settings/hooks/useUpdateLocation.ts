import { useState } from "react";
import { CurrentUserDocument, useUpdateLocationMutation } from "@/gql/graphql";
import { parseUserActionError, type UserActionErrorMessage } from "@/features/users/utils/parseUserActionError";
import type { UpdateProfileFormValues } from "@/types/user.types";

export function useUpdateLocation() {
  const [errorMessage, setErrorMessage] = useState<UserActionErrorMessage | null>(null);
  const [success, setSuccess] = useState(false);

  const [updateLocation, { loading }] = useUpdateLocationMutation({
    refetchQueries: [CurrentUserDocument],
    onError: (err: unknown) => setErrorMessage(parseUserActionError(err)),
  });

  const handleUpdate = async (values: UpdateProfileFormValues) => {
    setErrorMessage(null);
    setSuccess(false);

    const result = await updateLocation({
      variables: {
        updateProfileInput: {
          location: {
            city: values.location.city || null,
            country: values.location.country || null,
            latitude: values.location.latitude ?? null,
            longitude: values.location.longitude ?? null,
            neighborhood: values.location.neighborhood || null,
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
