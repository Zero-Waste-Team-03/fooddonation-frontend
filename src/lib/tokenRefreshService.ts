import type { ApolloClient } from "@apollo/client";
import { authStorage } from "@/lib/authStorage";
import { jotaiStore } from "@/lib/store";
import { router } from "@/lib/router";
import {
  accessTokenAtom,
  authUserAtom,
  authValidationStatusAtom,
  refreshTokenAtom,
} from "@/store";
import { RefreshTokensDocument } from "@/gql/graphql";
import type { RefreshTokensMutation } from "@/gql/graphql";

let apolloClient: ApolloClient | null = null;

export function registerApolloClient(client: ApolloClient): void {
  apolloClient = client;
}

function getClient(): ApolloClient {
  if (!apolloClient) {
    throw new Error("Apollo client not registered.");
  }
  return apolloClient;
}

type RefreshResult = { success: true } | { success: false };

let refreshPromise: Promise<RefreshResult> | null = null;

async function attemptRefresh(): Promise<RefreshResult> {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    return { success: false };
  }

  try {
    const result = await getClient().mutate<RefreshTokensMutation>({
      mutation: RefreshTokensDocument,
      context: {
        skipAuthLink: true,
        headers: { authorization: `Bearer ${refreshToken.trim()}` },
      },
    });

    const data = result.data?.refreshTokens;

    if (!data) {
      return { success: false };
    }

    const newAccessToken = data.accessToken;
    const newRefreshToken = data.refreshToken;
    const newUser = data.user;

    authStorage.setTokens(newAccessToken, newRefreshToken);
    authStorage.setAuthUser(newUser);

    jotaiStore.set(accessTokenAtom, newAccessToken);
    jotaiStore.set(refreshTokenAtom, newRefreshToken);
    jotaiStore.set(authUserAtom, newUser);

    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function refreshTokens(): Promise<RefreshResult> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = attemptRefresh().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export function clearAuthAndRedirect(): void {
  authStorage.clear();
  jotaiStore.set(accessTokenAtom, null);
  jotaiStore.set(refreshTokenAtom, null);
  jotaiStore.set(authUserAtom, null);
  jotaiStore.set(authValidationStatusAtom, "invalid");
  getClient().clearStore();
  void router.navigate({ to: "/login", search: { redirect: "/" } });
}
