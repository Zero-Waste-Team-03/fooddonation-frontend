import { useLoginMutation, type LoginInput } from "@/gql/graphql";
import { useAuthContext } from "@/providers/AuthProvider";
import { useNavigate } from "@tanstack/react-router";

export function useLogin(redirect = "/dashboard") {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [loginMutation, { loading, error }] = useLoginMutation();

  const handleLogin = async (input: LoginInput) => {
    const { data } = await loginMutation({ variables: { loginInput: input } });

    if (!data?.login) {
      throw new Error("No data returned from login mutation");
    }

    const result = data.login;

    login(result.accessToken, result.user, result.refreshToken);

    await navigate({ to: redirect });
  };

  return { handleLogin, loading, error };
}
