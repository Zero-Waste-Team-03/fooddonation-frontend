import { useLoginMutation, type LoginInput } from "@/gql/graphql";
import { useAuthContext } from "@/providers/AuthProvider";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { parseAuthError, type AuthErrorMessage } from "../utils/parseAuthError";

export function useLogin(redirect = "/dashboard") {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [loginMutation, { loading }] = useLoginMutation();
  const [errorMessage, setErrorMessage] = useState<AuthErrorMessage | null>(null);

  const handleLogin = async (input: LoginInput) => {
    setErrorMessage(null);

    try {
      const { data } = await loginMutation({ variables: { loginInput: input } });

      if (!data?.login) {
        setErrorMessage("An unexpected error occurred. Please try again.");
        return;
      }

      const result = data.login;

      login(result.accessToken, result.user, result.refreshToken);

      await navigate({ to: redirect });
    } catch (error) {
      setErrorMessage(parseAuthError(error));
    }
  };

  return { handleLogin, loading, errorMessage };
}
