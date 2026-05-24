import { atom } from "jotai";

export type NotificationFilters = {
  search: string;
  type: string | null;
  isRead: boolean | null;
};

export type IncomingNotification = {
  id: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  receivedAt: string;
};

export const notificationFiltersAtom = atom<NotificationFilters>({
  search: "",
  type: null,
  isRead: null,
});

export const selectedNotificationIdAtom = atom<string | null>(null);
export const incomingNotificationAtom = atom<IncomingNotification | null>(null);
export const unreadCountAtom = atom<number>(0);
export const notificationsPanelOpenAtom = atom<boolean>(false);
