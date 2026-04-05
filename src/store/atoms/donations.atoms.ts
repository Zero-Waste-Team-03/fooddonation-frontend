import { atom } from "jotai";
import type { DonationFilters } from "@/types/donation.types";

export const donationFiltersAtom = atom<DonationFilters>({
  search: "",
  status: null,
  urgency: null,
  categoryId: null,
});

export const selectedDonationIdAtom = atom<string | null>(null);

export const createDonationDialogOpenAtom = atom<boolean>(false);

export const deleteDonationDialogOpenAtom = atom<boolean>(false);

export const donationsPageAtom = atom<number>(1);

export const donationsPageSizeAtom = atom<number>(20);
