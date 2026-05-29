import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/features/reports/pages/ReportsPage";
import { guardRestrictedRoute, RestrictedRoute } from "@/lib/rolePermissions";

export const Route = createFileRoute("/_protected/reports")({
  beforeLoad: () => {
    guardRestrictedRoute(RestrictedRoute.ReportsAnalytics);
  },
  component: ReportsPage,
});
