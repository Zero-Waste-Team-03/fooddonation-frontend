import { atom } from "jotai";
import type { AuthUser } from "@/types/auth.types";

const initialAuthUser: AuthUser | null = (() => {
  const stored = localStorage.getItem("auth_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
})();

export const accessTokenAtom = atom<string | null>(
  localStorage.getItem("access_token")
);

export const refreshTokenAtom = atom<string | null>(
  localStorage.getItem("refresh_token")
);

export const authUserAtom = atom<AuthUser | null>(initialAuthUser);

export const isAuthenticatedAtom = atom<boolean>(
  (get) => get(accessTokenAtom) !== null
);
