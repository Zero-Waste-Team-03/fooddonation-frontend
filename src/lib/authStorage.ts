import type { AuthUser } from "@/types/auth.types";

const KEYS = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  authUser: "auth_user",
} as const;

export const authStorage = {
  getAccessToken: (): string | null => localStorage.getItem(KEYS.accessToken),

  getRefreshToken: (): string | null => localStorage.getItem(KEYS.refreshToken),

  getAuthUser: (): AuthUser | null => {
    try {
      const raw = localStorage.getItem(KEYS.authUser);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(KEYS.accessToken, accessToken);
    localStorage.setItem(KEYS.refreshToken, refreshToken);
  },

  setAuthUser: (user: AuthUser): void => {
    localStorage.setItem(KEYS.authUser, JSON.stringify(user));
  },

  clear: (): void => {
    localStorage.removeItem(KEYS.accessToken);
    localStorage.removeItem(KEYS.refreshToken);
    localStorage.removeItem(KEYS.authUser);
  },
};
