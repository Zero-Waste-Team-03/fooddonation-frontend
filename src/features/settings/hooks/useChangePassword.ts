import { useState } from "react";
import { useChangePasswordMutation } from "@/gql/graphql";
import type { ChangePasswordFormValues } from "@/types/user.types";

export type ChangePasswordError =
  | "Current password is incorrect."
  | "A network error occurred. Check your connection and try again."
  | "Password could not be changed. Please try again.";

type GraphQLErrorShape = {
  message?: string;
  extensions?: unknown;
};

function getFirstGraphQLError(error: unknown): GraphQLErrorShape | null {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const graphQLErrors = (error as { graphQLErrors?: unknown }).graphQLErrors;
  if (!Array.isArray(graphQLErrors) || !graphQLErrors.length) {
    return null;
  }

  const first = graphQLErrors[0];
  if (typeof first !== "object" || first === null) {
    return null;
  }

  return first as GraphQLErrorShape;
}

export function useChangePassword() {
  const [errorMessage, setErrorMessage] = useState<ChangePasswordError | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [changePassword, { loading }] = useChangePasswordMutation({
    onError: (err: unknown) => {
      if (typeof err === "object" && err !== null && "networkError" in err && (err as { networkError?: unknown }).networkError) {
        setErrorMessage("A network error occurred. Check your connection and try again.");
        return;
      }

      const gqlError = getFirstGraphQLError(err);
      const code =
        gqlError && typeof gqlError.extensions === "object" && gqlError.extensions !== null
          ? (gqlError.extensions as { code?: string }).code
          : undefined;
      const message = typeof gqlError?.message === "string" ? gqlError.message.toLowerCase() : "";

      if (
        code === "UNAUTHENTICATED" ||
        message.includes("incorrect") ||
        message.includes("wrong") ||
        message.includes("invalid")
      ) {
        setErrorMessage("Current password is incorrect.");
      } else {
        setErrorMessage("Password could not be changed. Please try again.");
      }
    },
  });

  const handleChange = async (values: ChangePasswordFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await changePassword({
      variables: {
        changePasswordInput: {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          logoutFromOtherDevices: values.logoutFromOtherDevices,
        },
      },
    });

    if (result.data?.changePassword) {
      setSuccessMessage(result.data.changePassword.message);
    }
  };

  const clearState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return {
    handleChange,
    loading,
    errorMessage,
    successMessage,
    clearState,
  };
}
