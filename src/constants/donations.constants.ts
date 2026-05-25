import { DonationStatusValues } from "@/gql/graphql";

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
