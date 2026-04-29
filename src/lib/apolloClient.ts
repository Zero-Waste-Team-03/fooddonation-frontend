import {
  ApolloClient,
  InMemoryCache,
  Observable,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { authStorage } from "@/lib/authStorage";
import {
  clearAuthAndRedirect,
  refreshTokens,
  registerApolloClient,
} from "@/lib/tokenRefreshService";

const AUTH_BYPASS_OPERATIONS = new Set([
  "Login",
  "ForgotPassword",
  "ResetPassword",
  "RefreshTokens",
]);

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_GRAPHQL_URL,
});

const authLink = setContext((_operation, prevContext) => {
  if (prevContext.skipAuthLink) {
    return { headers: prevContext.headers };
  }

  const token = authStorage.getAccessToken();
  return {
    headers: {
      ...(prevContext.headers ?? {}),
      ...(token ? { authorization: `Bearer ${token.trim()}` } : {}),
    },
  };
});

const errorLink = onError(({ error, operation, forward }) => {
  if (AUTH_BYPASS_OPERATIONS.has(operation.operationName ?? "")) {
    return;
  }

  const is401 = (() => {
    if (CombinedGraphQLErrors.is(error)) {
      return error.errors.some(
        (graphQLError) =>
          graphQLError.extensions?.code === "UNAUTHENTICATED" ||
          String(graphQLError.extensions?.code ?? "").includes("401")
      );
    }

    if (error && typeof error === "object" && "statusCode" in error) {
      return (error as { statusCode?: number }).statusCode === 401;
    }

    return false;
  })();

  if (!is401) {
    return;
  }

  return new Observable((observer) => {
    refreshTokens()
      .then((result) => {
        if (!result.success) {
          clearAuthAndRedirect();
          observer.error(
            new Error("Your session has expired. Please log in again.")
          );
          return;
        }

        const newToken = authStorage.getAccessToken();

        operation.setContext((currentContext: Record<string, unknown>) => {
          const existingHeaders =
            (currentContext.headers as Record<string, string> | undefined) ?? {};
          return {
            headers: {
              ...existingHeaders,
              ...(newToken
                ? { authorization: `Bearer ${newToken.trim()}` }
                : {}),
            },
          };
        });

        forward(operation).subscribe({
          next: (value) => observer.next(value),
          error: (error) => observer.error(error),
          complete: () => observer.complete(),
        });
      })
      .catch(() => {
        clearAuthAndRedirect();
        observer.error(
          new Error("Your session has expired. Please log in again.")
        );
      });
  });
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  devtools: { enabled: import.meta.env.DEV },
});

registerApolloClient(apolloClient);
