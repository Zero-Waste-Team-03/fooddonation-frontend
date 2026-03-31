import { useAtomValue } from "jotai";
import { authValidationStatusAtom } from "@/store";
import { useValidateToken } from "@/features/auth/hooks/useValidateToken";
import type { ReactNode } from "react";

type TokenValidatorProps = {
  children: ReactNode;
};

export function TokenValidator({ children }: TokenValidatorProps) {
  useValidateToken();
  const status = useAtomValue(authValidationStatusAtom);

  if (status === "idle" || status === "validating") {
    return (
      <div
        className="flex h-screen w-full items-center justify-center bg-background"
        role="status"
        aria-label="Verifying session"
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary"
          aria-hidden="true"
        />
      </div>
    );
  }

  return <>{children}</>;
}
