import { useState } from "react";
import { useSetAtom } from "jotai";
import {
  NotificationsDocument,
  useDeleteNotificationMutation,
  useMarkNotificationsAsReadMutation,
} from "@/gql/graphql";
import { unreadCountAtom } from "@/store";
import {
  parseNotificationError,
  type NotificationActionErrorMessage,
} from "../utils/parseNotificationError";

export function useNotificationActions() {
  const [errorMessage, setErrorMessage] = useState<NotificationActionErrorMessage | null>(null);
  const setUnreadCount = useSetAtom(unreadCountAtom);

  const [markReadMutation, { loading: marking }] = useMarkNotificationsAsReadMutation({
    refetchQueries: [NotificationsDocument],
    onError: (err: unknown) => setErrorMessage(parseNotificationError(err)),
  });
  const [deleteMutation, { loading: deleting }] = useDeleteNotificationMutation({
    refetchQueries: [NotificationsDocument],
    onError: (err: unknown) => setErrorMessage(parseNotificationError(err)),
  });

  const handleMarkAsRead = async (id: string): Promise<boolean> => {
    setErrorMessage(null);
    const result = await markReadMutation({ variables: { input: { ids: [id] } } });
    if (result.data?.markNotificationsAsRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    return !!result.data?.markNotificationsAsRead;
  };

  const handleMarkManyAsRead = async (ids: string[]): Promise<boolean> => {
    setErrorMessage(null);
    const result = await markReadMutation({ variables: { input: { ids } } });
    if (result.data?.markNotificationsAsRead) {
      setUnreadCount((prev) => Math.max(0, prev - ids.length));
    }
    return !!result.data?.markNotificationsAsRead;
  };

  const handleDelete = async (id: string, isUnread: boolean): Promise<boolean> => {
    setErrorMessage(null);
    const result = await deleteMutation({ variables: { id } });
    if (result.data?.deleteNotification && isUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    return !!result.data?.deleteNotification;
  };

  return {
    handleMarkAsRead,
    handleMarkManyAsRead,
    handleDelete,
    loading: marking || deleting,
    errorMessage,
    clearError: () => setErrorMessage(null),
  };
}
