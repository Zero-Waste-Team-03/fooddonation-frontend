import { useEffect } from "react";
import { toast } from "sonner";
import { useAtom, useSetAtom } from "jotai";
import { Bell } from "lucide-react";
import { incomingNotificationAtom, notificationsPanelOpenAtom } from "@/store";

export function NotificationToast() {
  const [incoming, setIncoming] = useAtom(incomingNotificationAtom);
  const setPanelOpen = useSetAtom(notificationsPanelOpenAtom);

  useEffect(() => {
    if (!incoming) return;

    toast(incoming.title, {
      description: incoming.body,
      icon: <Bell className="h-4 w-4 text-primary" />,
      duration: 5000,
      action: {
        label: "View",
        onClick: () => {
          setPanelOpen(true);
        },
      },
    });

    setIncoming(null);
  }, [incoming, setIncoming, setPanelOpen]);

  return null;
}
