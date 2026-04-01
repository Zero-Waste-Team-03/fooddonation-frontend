import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { jotaiStore } from "@/lib/store";
import { authValidationStatusAtom, isAuthenticatedAtom } from "@/store";

export const Route = createFileRoute("/_auth")({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/",
  }),
  beforeLoad: ({ search }) => {
    const validationStatus = jotaiStore.get(authValidationStatusAtom);
    if (validationStatus === "idle" || validationStatus === "validating") {
      return;
    }

    if (jotaiStore.get(isAuthenticatedAtom)) {
      throw redirect({ href: search.redirect });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}
