export type DonationStatus =
  | "AVAILABLE"
  | "PENDING"
  | "RESERVED"
  | "COLLECTED"
  | "CANCELLED"
  | "EXPIRED";

export type Donation = {
  id: string;
  title: string;
  category: string;
  status: DonationStatus;
  donorId: string;
  beneficiaryId: string | null;
  expiresAt: string;
  createdAt: string;
};
