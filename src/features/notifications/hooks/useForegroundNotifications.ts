import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { incomingNotificationAtom, unreadCountAtom } from "@/store";
import { onForegroundMessage } from "@/lib/fcmToken";

export function useForegroundNotifications() {
  const setIncoming = useSetAtom(incomingNotificationAtom);
  const setUnreadCount = useSetAtom(unreadCountAtom);

  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      setIncoming({
        id: Date.now().toString(),
        title: payload.title,
        body: payload.body,
        data: payload.data,
        receivedAt: new Date().toISOString(),
      });
      setUnreadCount((prev) => prev + 1);
    });

    return unsubscribe;
  }, [setIncoming, setUnreadCount]);
}
