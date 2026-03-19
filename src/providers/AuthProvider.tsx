import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface AuthContext {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthCtx = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );

  const login = (newToken: string) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
  };

  return (
    <AuthCtx.Provider
      value={{ isAuthenticated: !!token, token, login, logout }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
