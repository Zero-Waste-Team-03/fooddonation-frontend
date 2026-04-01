import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useResetPasswordMutation, type ResetPasswordInput } from "@/gql/graphql";
import { parseAuthError, type AuthErrorMessage } from "../utils/parseAuthError";

export function useResetPassword() {
  const [resetPasswordMutation, { loading }] = useResetPasswordMutation();
  const [errorMessage, setErrorMessage] = useState<AuthErrorMessage | null>(null);
  const navigate = useNavigate();

  const handleResetPassword = async (input: ResetPasswordInput) => {
    setErrorMessage(null);

    try {
      const { data } = await resetPasswordMutation({
        variables: { resetPasswordInput: input },
      });

      if (!data?.resetPassword) {
        setErrorMessage("An unexpected error occurred. Please try again.");
        return;
      }

      await navigate({ to: "/login", search: { redirect: "/dashboard", reset: "success" } });
    } catch (error) {
      setErrorMessage(parseAuthError(error));
    }
  };

  return { handleResetPassword, loading, errorMessage };
}
