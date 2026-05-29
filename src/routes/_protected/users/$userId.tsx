import { createFileRoute } from "@tanstack/react-router";
import { UserDetailPage } from "@/features/users/pages/UserDetailPage";
import { guardRestrictedRoute, RestrictedRoute } from "@/lib/rolePermissions";

export const Route = createFileRoute("/_protected/users/$userId")({
  beforeLoad: () => {
    guardRestrictedRoute(RestrictedRoute.UsersManagement);
  },
  component: UserDetailRoute,
});

function UserDetailRoute() {
  const { userId } = Route.useParams();
  return <UserDetailPage userId={userId} />;
}
