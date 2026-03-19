import { createContext, useContext, type ReactNode } from "react";
import { useAtom, useAtomValue } from "jotai";
import { accessTokenAtom, isAuthenticatedAtom } from "@/store/atoms";

export interface AuthContext {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthCtx = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useAtom(accessTokenAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  const login = (newToken: string) => setToken(newToken);

  const logout = () => setToken(null);

  return <AuthCtx.Provider value={{ isAuthenticated, token, login, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
