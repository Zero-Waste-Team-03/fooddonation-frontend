import { createFileRoute } from "@tanstack/react-router";
import { DonationDetailPage } from "@/features/donations/pages/DonationDetailPage";

export const Route = createFileRoute("/_protected/donations/$donationId")({
  component: DonationDetailPage,
});
