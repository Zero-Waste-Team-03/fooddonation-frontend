import { useAtomValue } from "jotai";
import { useNotificationsQuery } from "@/gql/graphql";
import { notificationFiltersAtom } from "@/store";

const PAGINATION = { page: 1, limit: 200 } as const;

export function useNotifications() {
  const filters = useAtomValue(notificationFiltersAtom);
  const { data, loading, error, refetch } = useNotificationsQuery({
    variables: { pagination: PAGINATION },
    fetchPolicy: "cache-and-network",
  });

  const notifications = (data?.notifications ?? []).filter((item) => {
    const search = filters.search.trim().toLowerCase();
    const matchesSearch =
      search.length === 0 ||
      item.title.toLowerCase().includes(search) ||
      item.body.toLowerCase().includes(search);
    const matchesType = filters.type == null || item.type === filters.type;
    const matchesRead = filters.isRead == null || item.isRead === filters.isRead;
    return matchesSearch && matchesType && matchesRead;
  });

  return {
    notifications,
    loading,
    error,
    refetch,
  };
}
