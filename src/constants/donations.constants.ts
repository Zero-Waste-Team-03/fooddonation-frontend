import { DonationStatusValues } from "@/gql/graphql";

export const DONATION_TABLE_LABELS = {
  listing: "Listing",
  donor: "Donor",
  status: "Status",
  urgency: "Urgency",
  category: "Category",
  location: "Location",
  created: "Created",
  expires: "Expires",
  actions: "Actions",
  empty: "No donations found",
  caption: "Donation listings with donor, status, urgency, and dates",
} as const;

export const DONATION_ACTION_LABELS = {
  verify: "Verify",
  cancel: "Cancel",
  confirmVerify: "Verify",
  verifying: "Verifying...",
} as const;

export const DONATION_VERIFY_DIALOG = {
  title: "Verify donation",
  irreversibleWarning:
    "This will approve the donation for publication. This action cannot be undone.",
} as const;

export function canVerifyDonation(status: DonationStatusValues): boolean {
  return status === DonationStatusValues.PendingApproval;
}
