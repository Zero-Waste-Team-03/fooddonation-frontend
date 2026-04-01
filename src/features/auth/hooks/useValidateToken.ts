import { useEffect } from "react";
import { useCurrentUserLazyQuery } from "@/gql/graphql";
import { jotaiStore } from "@/lib/store";
import { authStorage } from "@/lib/authStorage";
import {
  accessTokenAtom,
  authUserAtom,
  authValidationStatusAtom,
} from "@/store";
import { refreshTokens } from "@/lib/tokenRefreshService";

export function useValidateToken() {
  const [validateToken] = useCurrentUserLazyQuery({
    fetchPolicy: "network-only",
    errorPolicy: "none",
  });

  useEffect(() => {
    let mounted = true;
    const accessToken = authStorage.getAccessToken();
    const refreshToken = authStorage.getRefreshToken();

    if (!accessToken && !refreshToken) {
      if (mounted) jotaiStore.set(authValidationStatusAtom, "invalid");
      return () => {
        mounted = false;
      };
    }

    jotaiStore.set(authValidationStatusAtom, "validating");

    const run = async () => {
      if (accessToken) {
        try {
          const { data } = await validateToken();
          if (!mounted) return;
          if (data?.currentUser) {
            authStorage.setAuthUser(data.currentUser);
            jotaiStore.set(accessTokenAtom, accessToken);
            jotaiStore.set(authUserAtom, data.currentUser);
            jotaiStore.set(authValidationStatusAtom, "valid");
            return;
          }
        } catch {
          if (!mounted) return;
        }
      }

      if (refreshToken) {
        const result = await refreshTokens();
        if (!mounted) return;
        if (result.success) {
          try {
            const { data } = await validateToken();
            if (!mounted) return;
            if (data?.currentUser) {
              jotaiStore.set(authValidationStatusAtom, "valid");
              return;
            }
          } catch {
            if (!mounted) return;
          }
        }
      }

      if (!mounted) return;
      authStorage.clear();
      jotaiStore.set(accessTokenAtom, null);
      jotaiStore.set(authUserAtom, null);
      jotaiStore.set(authValidationStatusAtom, "invalid");
    };

    void run();

    return () => {
      mounted = false;
    };
  }, []);
}
