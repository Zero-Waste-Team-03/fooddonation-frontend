import { createFileRoute } from "@tanstack/react-router";
import { UsersPage } from "@/features/users/pages/UsersPage";
import { guardRestrictedRoute, RestrictedRoute } from "@/lib/rolePermissions";

export const Route = createFileRoute("/_protected/users/")({
  beforeLoad: () => {
    guardRestrictedRoute(RestrictedRoute.UsersManagement);
  },
  component: UsersPage,
});
