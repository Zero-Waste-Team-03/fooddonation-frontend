import { useState } from "react";
import {
  NotificationsDocument,
  useDeleteNotificationMutation,
  useMarkNotificationsAsReadMutation,
} from "@/gql/graphql";
import {
  parseNotificationError,
  type NotificationActionErrorMessage,
} from "../utils/parseNotificationError";

export function useNotificationActions() {
  const [errorMessage, setErrorMessage] = useState<NotificationActionErrorMessage | null>(null);

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
    return !!result.data?.markNotificationsAsRead;
  };

  const handleMarkManyAsRead = async (ids: string[]): Promise<boolean> => {
    setErrorMessage(null);
    const result = await markReadMutation({ variables: { input: { ids } } });
    return !!result.data?.markNotificationsAsRead;
  };

  const handleDelete = async (id: string): Promise<boolean> => {
    setErrorMessage(null);
    const result = await deleteMutation({ variables: { id } });
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
