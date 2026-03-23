import { createContext, useContext, type ReactNode } from "react";
import { useAtom, useAtomValue } from "jotai";
import { accessTokenAtom, authUserAtom, isAuthenticatedAtom, refreshTokenAtom } from "@/store/atoms";
import type { AuthUser } from "@/types/auth.types";
import { jotaiStore, router } from "@/main";

export interface AuthContext {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser, refreshToken?: string | null) => void;
  logout: () => void;
}

const AuthCtx = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useAtom(accessTokenAtom);
  const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);
  const [user, setUser] = useAtom(authUserAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  const login = (newToken: string, newUser: AuthUser, newRefreshToken?: string | null) => {
    if (newUser.role !== "Administrator") {
      throw new Error("Unauthorized: User does not have the required role");
    }
    localStorage.setItem("access_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    jotaiStore.set(accessTokenAtom, newToken);
    jotaiStore.set(authUserAtom, newUser);
    if (newRefreshToken) {
      localStorage.setItem("refresh_token", newRefreshToken);
      jotaiStore.set(refreshTokenAtom, newRefreshToken);
    } else {
      localStorage.removeItem("refresh_token");
      jotaiStore.set(refreshTokenAtom, null);
    }
    setToken(newToken);
    setUser(newUser);
    setRefreshToken(newRefreshToken ?? null);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("refresh_token");
    jotaiStore.set(accessTokenAtom, null);
    jotaiStore.set(authUserAtom, null);
    jotaiStore.set(refreshTokenAtom, null);
    setToken(null);
    setUser(null);
    setRefreshToken(null);
    void router.navigate({ to: "/login", search: { redirect: "/dashboard" } });
  };

  return (
    <AuthCtx.Provider value={{ isAuthenticated, token, refreshToken, user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
