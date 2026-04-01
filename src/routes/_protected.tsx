import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { jotaiStore } from "@/lib/store";
import { authValidationStatusAtom, isAuthenticatedAtom } from "@/store";

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ location }) => {
    const validationStatus = jotaiStore.get(authValidationStatusAtom);

    if (validationStatus === "idle" || validationStatus === "validating") {
      return;
    }

    if (!jotaiStore.get(isAuthenticatedAtom)) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
