import { redirect } from "@tanstack/react-router";
import { UserRole } from "@/gql/graphql";
import { APP_ROUTES } from "@/constants/routes.constants";
import { jotaiStore } from "@/lib/store";
import { authUserAtom } from "@/store";

export enum RestrictedRoute {
  UsersManagement = "usersManagement",
  ReportsAnalytics = "reportsAnalytics",
}

const LOCAL_AUTHORITY_RESTRICTED_ROUTES: ReadonlySet<RestrictedRoute> = new Set([
  RestrictedRoute.UsersManagement,
  RestrictedRoute.ReportsAnalytics,
]);

export function isRouteRestrictedForRole(
  restrictedRoute: RestrictedRoute,
  role: UserRole | null | undefined
): boolean {
  if (role !== UserRole.LocalAuthority) {
    return false;
  }

  return LOCAL_AUTHORITY_RESTRICTED_ROUTES.has(restrictedRoute);
}

export function canAccessRestrictedRoute(
  restrictedRoute: RestrictedRoute,
  role: UserRole | null | undefined
): boolean {
  return !isRouteRestrictedForRole(restrictedRoute, role);
}

export function guardRestrictedRoute(restrictedRoute: RestrictedRoute): void {
  const role = jotaiStore.get(authUserAtom)?.role;

  if (!canAccessRestrictedRoute(restrictedRoute, role)) {
    throw redirect({ to: APP_ROUTES.Dashboard });
  }
}
