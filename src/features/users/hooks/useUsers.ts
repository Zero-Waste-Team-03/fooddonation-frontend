import { useEffect, useMemo } from "react";
import { useAdminGetUsersQuery } from "@/gql/graphql";
import { useAtomValue } from "jotai";
import { userFiltersAtom, usersPageAtom, usersPageSizeAtom } from "@/store";
import { buildUsersQueryVariables } from "../utils/buildUsersQueryVariables";

export function useUsers() {
  const page = useAtomValue(usersPageAtom);
  const limit = useAtomValue(usersPageSizeAtom);
  const filters = useAtomValue(userFiltersAtom);
  const variables = useMemo(
    () => buildUsersQueryVariables(page, limit, filters),
    [page, limit, filters]
  );

  const { data, loading, error, refetch } = useAdminGetUsersQuery({
    variables,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    console.groupCollapsed("[Users Query]");
    console.log("variables", variables);
    console.log("loading", loading);
    console.log("error", error);
    console.log("pagination", data?.adminGetUsers ?? null);
    console.log("itemsCount", data?.adminGetUsers?.items?.length ?? 0);
    console.log("items", data?.adminGetUsers?.items ?? []);
    console.groupEnd();
  }, [variables, loading, error, data]);

  return {
    users: data?.adminGetUsers?.items ?? [],
    pagination: data?.adminGetUsers
      ? {
          page: data.adminGetUsers.page,
          limit: data.adminGetUsers.limit,
          totalCount: data.adminGetUsers.totalCount,
          hasNextPage: data.adminGetUsers.hasNextPage,
          hasPreviousPage: data.adminGetUsers.hasPreviousPage,
        }
      : null,
    loading,
    error,
    refetch,
  };
}
