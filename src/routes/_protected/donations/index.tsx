import { createFileRoute } from "@tanstack/react-router";
import { DonationsPage } from "@/features/donations/pages/DonationsPage";

export const Route = createFileRoute("/_protected/donations/")({
  component: DonationsPage,
});
