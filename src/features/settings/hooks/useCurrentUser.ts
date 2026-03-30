import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useCurrentUserQuery } from "@/gql/graphql";
import { authUserAtom } from "@/store";

export function useCurrentUser() {
  const setAuthUser = useSetAtom(authUserAtom);
  const { data, loading, error } = useCurrentUserQuery({
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (!data?.currentUser) {
      return;
    }
    const { id, email, role, displayName } = data.currentUser;
    setAuthUser({ id, email, role, displayName });
  }, [data, setAuthUser]);

  return {
    user: data?.currentUser ?? null,
    loading,
    error,
  };
}
