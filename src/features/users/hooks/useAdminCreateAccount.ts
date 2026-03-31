import { useState } from "react";
import {
  AdminGetUserStatsDocument,
  AdminGetUsersDocument,
  useAdminCreateAccountMutation,
  type UserRole,
} from "@/gql/graphql";
import { parseUserActionError, type UserActionErrorMessage } from "../utils/parseUserActionError";

export type AdminCreateAccountFormValues = {
  displayName: string;
  email: string;
  role: UserRole;
};

export function useAdminCreateAccount() {
  const [errorMessage, setErrorMessage] = useState<UserActionErrorMessage | null>(null);
  const [success, setSuccess] = useState(false);

  const [createAccount, { loading }] = useAdminCreateAccountMutation({
    refetchQueries: [AdminGetUsersDocument, AdminGetUserStatsDocument],
    onError: (err: unknown) => setErrorMessage(parseUserActionError(err)),
  });

  const handleCreate = async (values: AdminCreateAccountFormValues) => {
    setErrorMessage(null);
    setSuccess(false);
    const result = await createAccount({
      variables: { input: values },
    });
    if (result.data?.adminCreateAccount) {
      setSuccess(true);
    }
  };

  const reset = () => {
    setSuccess(false);
    setErrorMessage(null);
  };

  return {
    handleCreate,
    loading,
    errorMessage,
    success,
    reset,
  };
}
