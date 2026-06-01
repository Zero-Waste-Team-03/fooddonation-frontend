import { DONATION_TABLE_LABELS } from "@/constants/donations.constants";
import type { Donation } from "@/types/donation.types";
import { donationStatusLabels, donationUrgencyLabels } from "../components/DonationFilters";
import { formatDonationDate, formatDonationLocation } from "./formatDonationDisplay";

function formatListingCell(donation: Donation): string {
  return `${donation.title} — ${donation.description}`;
}

function formatDonorCell(donation: Donation): string {
  const name = donation.user.displayName ?? "—";
  return `${name} (${donation.user.email})`;
}

function formatCategoryCell(donation: Donation): string {
  return donation.category?.name ?? "—";
}

export function getDonationsCsvHeaders(): string[] {
  return [
    DONATION_TABLE_LABELS.listing,
    DONATION_TABLE_LABELS.donor,
    DONATION_TABLE_LABELS.status,
    DONATION_TABLE_LABELS.urgency,
    DONATION_TABLE_LABELS.category,
    DONATION_TABLE_LABELS.location,
    DONATION_TABLE_LABELS.created,
    DONATION_TABLE_LABELS.expires,
  ];
}

export function mapDonationsToCsvRows(donations: Donation[]): string[][] {
  return donations.map((donation) => [
    formatListingCell(donation),
    formatDonorCell(donation),
    donationStatusLabels[donation.status],
    donationUrgencyLabels[donation.urgency],
    formatCategoryCell(donation),
    formatDonationLocation(donation),
    formatDonationDate(donation.createdAt),
    formatDonationDate(donation.expiryDate),
  ]);
}
