import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useAtomValue } from "jotai";
import type { AuthUser } from "@/types/auth.types";
import { authStorage } from "@/lib/authStorage";
import { jotaiStore } from "@/lib/store";
import {
  accessTokenAtom,
  authUserAtom,
  authValidationStatusAtom,
  isAuthenticatedAtom,
  refreshTokenAtom,
} from "@/store";
import { clearAuthAndRedirect } from "@/lib/tokenRefreshService";

export interface AuthContext {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthCtx = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const user = useAtomValue(authUserAtom);

  const login = (accessToken: string, refreshToken: string, newUser: AuthUser) => {
    authStorage.setTokens(accessToken, refreshToken);
    authStorage.setAuthUser(newUser);
    jotaiStore.set(accessTokenAtom, accessToken);
    jotaiStore.set(refreshTokenAtom, refreshToken);
    jotaiStore.set(authUserAtom, newUser);
    jotaiStore.set(authValidationStatusAtom, "valid");
  };

  const logout = () => {
    clearAuthAndRedirect();
  };

  return (
    <AuthCtx.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
