import type { DonationFilters } from "@/types/donation.types";

export function buildDonationsQueryVariables(
  page: number,
  limit: number,
  filters: DonationFilters
) {
  const filter =
    filters.status != null ||
    filters.urgency != null ||
    (filters.category != null && filters.category.trim() !== "")
      ? {
          ...(filters.status != null ? { status: filters.status } : {}),
          ...(filters.urgency != null ? { urgency: filters.urgency } : {}),
          ...(filters.category != null && filters.category.trim() !== ""
            ? { categoryId: filters.category.trim() }
            : {}),
        }
      : undefined;

  return {
    pagination: { page, limit },
    filter,
  };
}
