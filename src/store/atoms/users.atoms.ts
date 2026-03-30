import { atom } from "jotai";
import type { UserFilters } from "@/types/user.types";

export const userFiltersAtom = atom<UserFilters>({
  search: "",
  role: null,
  status: null,
});

export const selectedUserIdAtom = atom<string | null>(null);

export const createUserDialogOpenAtom = atom<boolean>(false);

export const suspendUserDialogOpenAtom = atom<boolean>(false);

export const activateUserDialogOpenAtom = atom<boolean>(false);

export const sendNotificationDialogOpenAtom = atom<boolean>(false);

export const usersPageAtom = atom<number>(1);

export const usersPageSizeAtom = atom<number>(20);
