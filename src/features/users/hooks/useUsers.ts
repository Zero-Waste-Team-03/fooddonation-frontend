import { useEffect } from "react";
import { useAdminGetUsersQuery } from "@/gql/graphql";
import { useAtomValue } from "jotai";
import { userFiltersAtom, usersPageAtom, usersPageSizeAtom } from "@/store";

export function useUsers() {
  const page = useAtomValue(usersPageAtom);
  const limit = useAtomValue(usersPageSizeAtom);
  const filters = useAtomValue(userFiltersAtom);

  const { data, loading, error, refetch } = useAdminGetUsersQuery({
    variables: {
      page,
      limit,
      search: filters.search || undefined,
      role: filters.role || undefined,
      status: filters.status || undefined,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    console.groupCollapsed("[Users Query]");
    console.log("variables", {
      page,
      limit,
      search: filters.search || undefined,
      role: filters.role || undefined,
      status: filters.status || undefined,
    });
    console.log("loading", loading);
    console.log("error", error);
    console.log("pagination", data?.adminGetUsers ?? null);
    console.log("itemsCount", data?.adminGetUsers?.items?.length ?? 0);
    console.log("items", data?.adminGetUsers?.items ?? []);
    console.groupEnd();
  }, [page, limit, filters.search, filters.role, filters.status, loading, error, data]);

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
