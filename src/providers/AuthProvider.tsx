import { createContext, useContext, type ReactNode } from "react";
import { useAtomValue } from "jotai";
import { accessTokenAtom, authUserAtom, isAuthenticatedAtom, refreshTokenAtom } from "@/store";
import type { AuthUser } from "@/types/auth.types";
import { jotaiStore, router } from "@/main";

export interface AuthContext {
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser, refreshToken?: string | null) => void;
  logout: () => void;
}

const AuthCtx = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  const login = (newToken: string, newUser: AuthUser, newRefreshToken?: string | null) => {
    if (newUser.role !== "Administrator") {
      throw new Error("Unauthorized: User does not have the required role");
    }
    jotaiStore.set(accessTokenAtom, newToken);
    jotaiStore.set(authUserAtom, newUser);
    if (newRefreshToken) {
      jotaiStore.set(refreshTokenAtom, newRefreshToken);
    } else {
      jotaiStore.set(refreshTokenAtom, null);
    }
  };

  const logout = () => {
    jotaiStore.set(accessTokenAtom, null);
    jotaiStore.set(authUserAtom, null);
    jotaiStore.set(refreshTokenAtom, null);
    void router.navigate({ to: "/login", search: { redirect: "/dashboard" } });
  };

  return (
    <AuthCtx.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
