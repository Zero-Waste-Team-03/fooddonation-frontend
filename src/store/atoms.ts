import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const accessTokenAtom = atomWithStorage<string | null>(
  "access_token",
  null
);

export const isAuthenticatedAtom = atom(
  (get) => get(accessTokenAtom) !== null
);

export const sidebarCollapsedAtom = atomWithStorage<boolean>(
  "sidebar_collapsed",
  false
);

export const selectedUserIdAtom = atom<string | null>(null);

export const selectedDonationIdAtom = atom<string | null>(null);

export const selectedZoneIdAtom = atom<string | null>(null);
