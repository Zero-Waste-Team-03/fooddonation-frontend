import { useState } from "react";
import {
  useSuspendUserMutation,
  useActivateUserMutation,
  useSendFcmNotificationMutation,
  AdminGetUsersDocument,
  AdminGetUserStatsDocument,
} from "@/gql/graphql";
import { parseUserActionError, type UserActionErrorMessage } from "../utils/parseUserActionError";
import type { SendNotificationInput } from "@/types/user.types";

export function useUserActions() {
  const [errorMessage, setErrorMessage] = useState<UserActionErrorMessage | null>(null);

  const [suspendUser, { loading: suspending }] = useSuspendUserMutation({
    refetchQueries: [AdminGetUsersDocument, AdminGetUserStatsDocument],
    onError: (err: unknown) => setErrorMessage(parseUserActionError(err)),
  });

  const [activateUser, { loading: activating }] = useActivateUserMutation({
    refetchQueries: [AdminGetUsersDocument, AdminGetUserStatsDocument],
    onError: (err: unknown) => setErrorMessage(parseUserActionError(err)),
  });

  const [sendNotification, { loading: sending }] = useSendFcmNotificationMutation({
    onError: (err: unknown) => setErrorMessage(parseUserActionError(err)),
  });

  const handleSuspend = async (userId: string) => {
    setErrorMessage(null);
    await suspendUser({ variables: { userId } });
  };

  const handleActivate = async (userId: string) => {
    setErrorMessage(null);
    await activateUser({ variables: { userId } });
  };

  const handleSendNotification = async (
    userId: string,
    title: string,
    body: string,
    type: string
  ) => {
    setErrorMessage(null);
    const input: SendNotificationInput = {
      title,
      body,
      type,
      metaData: { userId },
    };
    const result = await sendNotification({ variables: { input } });
    return result.data?.sendFcmNotification ?? null;
  };

  return {
    handleSuspend,
    handleActivate,
    handleSendNotification,
    loading: suspending || activating || sending,
    errorMessage,
    clearError: () => setErrorMessage(null),
  };
}
