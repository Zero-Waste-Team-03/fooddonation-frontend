import type { Donation } from "@/types/donation.types";

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export function formatDonationDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", dateFormatOptions).format(date);
}

export function formatDonationLocation(donation: Donation): string {
  const city = donation.location?.city ?? "";
  const country = donation.location?.country ?? "";
  const neighborhood = donation.location?.neighborhood ?? "";
  const parts = [neighborhood, city, country].filter((p) => p.trim().length > 0);
  return parts.length ? parts.join(", ") : "—";
}
