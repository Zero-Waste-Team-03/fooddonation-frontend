import { useState } from "react";
import { useForgotPasswordMutation } from "@/gql/graphql";
import { parseAuthError, type AuthErrorMessage } from "../utils/parseAuthError";

export function useForgotPassword() {
  const [forgotPasswordMutation, { loading }] = useForgotPasswordMutation();
  const [errorMessage, setErrorMessage] = useState<AuthErrorMessage | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleForgotPassword = async (email: string) => {
    setErrorMessage(null);
    setSuccess(false);

    try {
      const { data } = await forgotPasswordMutation({ variables: { email } });

      if (!data?.forgotPassword) {
        setErrorMessage("An unexpected error occurred. Please try again.");
        return;
      }

      setSuccess(true);
    } catch (error) {
      setErrorMessage(parseAuthError(error));
    }
  };

  return { handleForgotPassword, loading, errorMessage, success };
}
