import { useEffect } from "react";
import { useCurrentUserLazyQuery } from "@/gql/graphql";
import { jotaiStore } from "@/main";
import {
  accessTokenAtom,
  authUserAtom,
  authValidationStatusAtom,
  refreshTokenAtom,
} from "@/store";

export function useValidateToken() {
  const [validateToken] = useCurrentUserLazyQuery({
    fetchPolicy: "network-only",
    errorPolicy: "none",
  });

  useEffect(() => {
    let mounted = true;
    const token = jotaiStore.get(accessTokenAtom);

    if (!token) {
      if (mounted) {
        jotaiStore.set(authValidationStatusAtom, "invalid");
      }
      return () => {
        mounted = false;
      };
    }

    jotaiStore.set(authValidationStatusAtom, "validating");

    validateToken()
      .then(({ data, error }) => {
        if (!mounted) {
          return;
        }
        if (error || !data?.currentUser) {
          jotaiStore.set(authValidationStatusAtom, "invalid");
          jotaiStore.set(accessTokenAtom, null);
          jotaiStore.set(authUserAtom, null);
          jotaiStore.set(refreshTokenAtom, null);
          return;
        }
        const { id, email, role, displayName } = data.currentUser;
        jotaiStore.set(authUserAtom, { id, email, role, displayName });
        jotaiStore.set(authValidationStatusAtom, "valid");
      })
      .catch(() => {
        if (!mounted) {
          return;
        }
        jotaiStore.set(authValidationStatusAtom, "invalid");
        jotaiStore.set(accessTokenAtom, null);
        jotaiStore.set(authUserAtom, null);
        jotaiStore.set(refreshTokenAtom, null);
      });

    return () => {
      mounted = false;
    };
  }, []);
}
