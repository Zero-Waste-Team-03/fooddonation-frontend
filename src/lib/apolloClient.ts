import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import { router } from "@/main";

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

const errorLink = onError(({ error }) => {
  const graphQLErrors = CombinedGraphQLErrors.is(error) ? error.errors : undefined;
  const networkError = ServerError.is(error) ? error : undefined;

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.extensions?.code === "FORBIDDEN"
      ) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("refresh_token");
      }
    }
  }
  if (networkError) {
    console.error("Network error:", networkError.message);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  devtools: {
    enabled: import.meta.env.DEV,
  },
});
