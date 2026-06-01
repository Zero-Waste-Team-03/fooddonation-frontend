import { DonationsDocument, type DonationsQuery } from "@/gql/graphql";
import { fetchAllPaginated } from "@/lib/fetchAllPaginated";
import type { Donation, DonationFilters } from "@/types/donation.types";
import { buildDonationsQueryVariables } from "./buildDonationsQueryVariables";

export async function fetchAllDonations(
  limit: number,
  filters: DonationFilters
): Promise<Donation[]> {
  return fetchAllPaginated<
    DonationsQuery,
    ReturnType<typeof buildDonationsQueryVariables>,
    Donation
  >(limit, {
    query: DonationsDocument,
    buildVariables: (page, pageLimit) =>
      buildDonationsQueryVariables(page, pageLimit, filters),
    extractPage: (data) => {
      const result = data.donations;
      if (!result) {
        return null;
      }
      return {
        items: (result.items ?? []) as Donation[],
        hasNextPage: result.hasNextPage,
      };
    },
  });
}
