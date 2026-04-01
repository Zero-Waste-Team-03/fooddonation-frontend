import { atom } from "jotai";
import type { AuthUser } from "@/types/auth.types";
import { authStorage } from "@/lib/authStorage";

export type AuthValidationStatus = "idle" | "validating" | "valid" | "invalid";

export const accessTokenAtom = atom<string | null>(authStorage.getAccessToken());

export const refreshTokenAtom = atom<string | null>(
  authStorage.getRefreshToken()
);

export const authUserAtom = atom<AuthUser | null>(authStorage.getAuthUser());

export const authValidationStatusAtom = atom<AuthValidationStatus>("idle");

export const isAuthenticatedAtom = atom<boolean>(
  (get) => get(authValidationStatusAtom) === "valid"
);
