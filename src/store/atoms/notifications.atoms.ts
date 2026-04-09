import { atom } from "jotai";

export type NotificationFilters = {
  search: string;
  type: string | null;
  isRead: boolean | null;
};

export const notificationFiltersAtom = atom<NotificationFilters>({
  search: "",
  type: null,
  isRead: null,
});

export const selectedNotificationIdAtom = atom<string | null>(null);
