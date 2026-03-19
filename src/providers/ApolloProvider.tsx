import { ApolloProvider as BaseApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apolloClient";
import type { ReactNode } from "react";

export function ApolloProvider({ children }: { children: ReactNode }) {
  return (
    <BaseApolloProvider client={apolloClient}>{children}</BaseApolloProvider>
  );
}
