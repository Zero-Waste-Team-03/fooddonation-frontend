import {
  ApolloClient,
  type FetchResult,
  InMemoryCache,
  Observable,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import type { GraphQLError } from "graphql";
import { authStorage } from "@/lib/authStorage";
import { refreshTokens, clearAuthAndRedirect } from "@/lib/tokenRefreshService";

const AUTH_BYPASS_OPERATIONS = new Set([
  "Login",
  "ForgotPassword",
  "ResetPassword",
  "RefreshTokens",
]);

function getContextFlag(
  operation: unknown,
  key: string
): boolean {
  const op = operation as { getContext?: () => Record<string, unknown> };
  const ctx = op.getContext?.();
  return Boolean(ctx && ctx[key]);
}

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_GRAPHQL_URL,
});

const authLink = setContext((operation, { headers }) => {
  if (getContextFlag(operation, "skipAuthLink")) {
    return { headers };
  }

  const token = authStorage.getAccessToken();

  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token.trim()}` } : {}),
    },
  };
});

const errorLink = onError((errorResponse) => {
  const { graphQLErrors, networkError, operation, forward } = errorResponse as {
    graphQLErrors?: readonly GraphQLError[];
    networkError?: unknown;
    operation: { operationName?: string; setContext: (fn: unknown) => void };
    forward: (op: unknown) => Observable<FetchResult<Record<string, unknown>>>;
  };

  const isAuthBypass = AUTH_BYPASS_OPERATIONS.has(operation.operationName ?? "");
  if (isAuthBypass) return;

  const graphQlSays401 =
    graphQLErrors?.some((e: GraphQLError) => {
      const code = e.extensions?.code;
      return code === "UNAUTHENTICATED" || code === "401";
    }) ?? false;

  const networkSays401 = (() => {
    if (!networkError || typeof networkError !== "object") return false;
    if (!("statusCode" in networkError)) return false;
    const statusCode = (networkError as { statusCode?: unknown }).statusCode;
    return statusCode === 401;
  })();

  if (!graphQlSays401 && !networkSays401) return;

  return new Observable<FetchResult<Record<string, unknown>>>((observer) => {
    refreshTokens().then((result) => {
      if (!result.success) {
        clearAuthAndRedirect();
        observer.error(new Error("Session expired. Please log in again."));
        return;
      }

      const newToken = authStorage.getAccessToken();

      operation.setContext(
        (prev: { headers?: Record<string, unknown> } | undefined) => {
          const prevHeaders = prev?.headers ?? {};
          return {
            headers: {
              ...prevHeaders,
              ...(newToken ? { authorization: `Bearer ${newToken.trim()}` } : {}),
            },
          };
        }
      );

      forward(operation).subscribe(observer);
    });
  });
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  devtools: { enabled: import.meta.env.DEV },
});
