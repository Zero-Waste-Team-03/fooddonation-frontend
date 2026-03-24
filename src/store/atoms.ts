import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
export * from "./atoms/auth.atoms";
export * from "./atoms/ui.atoms";
export * from "./atoms/users.atoms";

export const sidebarCollapsedAtom = atomWithStorage<boolean>(
  "sidebar_collapsed",
  false
);

export const selectedUserIdAtom = atom<string | null>(null);

export const selectedDonationIdAtom = atom<string | null>(null);
