import type { Donation, DonationFilters } from "@/types/donation.types";

export function matchesDonationSearchFilter(
  donation: Donation,
  search: DonationFilters["search"]
): boolean {
  const q = search.trim().toLowerCase();
  if (!q) {
    return true;
  }

  const title = donation.title.toLowerCase();
  const desc = donation.description.toLowerCase();
  const categoryName = donation.category?.name.toLowerCase() ?? "";

  return title.includes(q) || desc.includes(q) || categoryName.includes(q);
}

export function filterDonationsBySearch(
  donations: Donation[],
  search: DonationFilters["search"]
): Donation[] {
  const q = search.trim();
  if (!q) {
    return donations;
  }
  return donations.filter((donation) => matchesDonationSearchFilter(donation, search));
}
