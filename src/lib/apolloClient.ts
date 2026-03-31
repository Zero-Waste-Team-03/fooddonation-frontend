import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import { jotaiStore, router } from "@/main";
import { accessTokenAtom, authUserAtom, authValidationStatusAtom, refreshTokenAtom } from "@/store/atoms/auth.atoms";

const AUTH_OPERATION_NAMES = new Set(["Login", "ForgotPassword", "ResetPassword"]);

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}

const debugLink = new ApolloLink((operation, forward) => {
  if (operation.operationName === "UpdateProfile") {
    const context = operation.getContext();
    console.group("[DEBUG] UpdateProfile request");
    console.log("variables:", JSON.stringify(operation.variables, null, 2));
    console.log("headers:", context.headers);
    console.log("token in storage:", localStorage.getItem("access_token"));
    console.groupEnd();
  }
  return forward(operation);
});

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  const token =
    jotaiStore.get(accessTokenAtom) ??
    localStorage.getItem("access_token");
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token.trim()}` } : {}),
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
        jotaiStore.set(accessTokenAtom, null);
        jotaiStore.set(authUserAtom, null);
        jotaiStore.set(refreshTokenAtom, null);
        jotaiStore.set(authValidationStatusAtom, "invalid");
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
  link: from([debugLink, errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  devtools: {
    enabled: import.meta.env.DEV,
  },
});
