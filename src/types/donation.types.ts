import type {
  CreateDonationInput,
  DonationStatistics,
  DonationStatusValues,
  DonationUrgencyValues,
  DonationsQuery,
} from "@/gql/graphql";

export type Donation = NonNullable<
  NonNullable<DonationsQuery["donations"]["items"]>[number]
>;

export type { CreateDonationInput, DonationStatistics };
export type { DonationStatusValues, DonationUrgencyValues };

export type DonationStatus = DonationStatusValues;

export type DonationFilters = {
  search: string;
  status: DonationStatusValues | null;
  urgency: DonationUrgencyValues | null;
  category: string | null;
};

export type CreateDonationFormValues = {
  title: string;
  description: string;
  category: string;
  mainAttachmentId: string;
  quantity: string;
  expiryDate: string;
  urgency?: DonationUrgencyValues;
  safetyChecklistCompleted?: boolean;
  listingExpiresAt?: string;
  locationId?: string;
  specification?: string;
};
