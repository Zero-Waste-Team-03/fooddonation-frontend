import { authStorage } from "@/lib/authStorage";
import { jotaiStore } from "@/lib/store";
import {
  accessTokenAtom,
  refreshTokenAtom,
  authUserAtom,
  authValidationStatusAtom,
} from "@/store";
import { router } from "@/lib/router";
import { RefreshTokensDocument } from "@/gql/graphql";
import type { RefreshTokensMutation } from "@/gql/graphql";

type RefreshResult = { success: true } | { success: false };

let refreshPromise: Promise<RefreshResult> | null = null;

async function attemptRefresh(): Promise<RefreshResult> {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    return { success: false };
  }

  try {
    const { apolloClient } = await import("./apolloClient");

    const result = await apolloClient.mutate<RefreshTokensMutation>({
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

  void import("./apolloClient").then(({ apolloClient }) => apolloClient.clearStore());

  void router.navigate({ to: "/login", search: { redirect: "/" } });
}
