import { createContext, useContext, type ReactNode } from "react";
import { useAtomValue } from "jotai";
import { UserRole } from "@/gql/graphql";
import {
  accessTokenAtom,
  authUserAtom,
  authValidationStatusAtom,
  refreshTokenAtom,
} from "@/store/atoms/auth.atoms";
import type { AuthUser } from "@/types/auth.types";
import { jotaiStore, router } from "@/main";

export interface AuthContext {
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser, refreshToken?: string | null) => void;
  logout: () => void;
}

const AuthCtx = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useAtomValue(accessTokenAtom);
  const validationStatus = useAtomValue(authValidationStatusAtom);
  const isAuthenticated = !!token && validationStatus === "valid";

  const login = (newToken: string, newUser: AuthUser, newRefreshToken?: string | null) => {
    if (newUser.role !== UserRole.Administrator) {
      throw new Error("Unauthorized: User does not have the required role");
    }
    jotaiStore.set(accessTokenAtom, newToken);
    jotaiStore.set(authUserAtom, newUser);
    if (newRefreshToken) {
      jotaiStore.set(refreshTokenAtom, newRefreshToken);
    } else {
      jotaiStore.set(refreshTokenAtom, null);
    }
    jotaiStore.set(authValidationStatusAtom, "valid");
  };

  const logout = () => {
    jotaiStore.set(accessTokenAtom, null);
    jotaiStore.set(authUserAtom, null);
    jotaiStore.set(refreshTokenAtom, null);
    jotaiStore.set(authValidationStatusAtom, "invalid");
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
