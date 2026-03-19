import { createFileRoute } from "@tanstack/react-router";
import { ZonesPage } from "@/features/zones/pages/ZonesPage";

export const Route = createFileRoute("/_protected/zones")({
  component: ZonesPage,
});
