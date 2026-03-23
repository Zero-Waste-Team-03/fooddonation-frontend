import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import { router } from "@/main";

const AUTH_OPERATION_NAMES = new Set(["Login", "ForgotPassword", "ResetPassword"]);

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("access_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ error, operation }) => {
  const graphQLErrors = CombinedGraphQLErrors.is(error) ? error.errors : undefined;
  const networkError = ServerError.is(error) ? error : undefined;
  const operationName = operation.operationName ?? "";
  const isAuthOperation = AUTH_OPERATION_NAMES.has(operationName);

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (isAuthOperation) {
        return;
      }

      if (
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.extensions?.code === "FORBIDDEN"
      ) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("refresh_token");
        void router.navigate({ to: "/login", search: { redirect: "/" } });
        return;
      }
    }
  }

  if (networkError) {
    console.error(`[Network Error] ${networkError.message}`);
    return;
  }

  if (!graphQLErrors && isErrorWithMessage(error)) {
    console.error(`[Network Error] ${error.message}`);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  devtools: {
    enabled: import.meta.env.DEV,
  },
});
