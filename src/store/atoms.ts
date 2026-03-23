import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
export * from "./atoms/auth.atoms";

export type ThemeMode = "light" | "dark";

export const sidebarCollapsedAtom = atomWithStorage<boolean>(
  "sidebar_collapsed",
  false
);

export const selectedUserIdAtom = atom<string | null>(null);

export const selectedDonationIdAtom = atom<string | null>(null);

export const themeModeAtom = atomWithStorage<ThemeMode>(
  "theme_mode",
  "light"
);
