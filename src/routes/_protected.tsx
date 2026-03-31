import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { jotaiStore } from "@/main";
import { authValidationStatusAtom } from "@/store";

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ context, location }) => {
    const validationStatus = jotaiStore.get(authValidationStatusAtom);

    if (validationStatus === "idle" || validationStatus === "validating") {
      return;
    }

    if (!context.auth.isAuthenticated) {
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
