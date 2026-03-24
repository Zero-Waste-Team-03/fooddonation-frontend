import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { AuthUser } from "@/types/auth.types";

export const accessTokenAtom = atomWithStorage<string | null>(
  "access_token",
  null
);

export const refreshTokenAtom = atomWithStorage<string | null>(
  "refresh_token",
  null
);

export const authUserAtom = atomWithStorage<AuthUser | null>(
  "auth_user",
  null
);

export const isAuthenticatedAtom = atom<boolean>(
  (get) => get(accessTokenAtom) !== null
);
