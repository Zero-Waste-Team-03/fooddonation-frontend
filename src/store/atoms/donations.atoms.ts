import { atom } from "jotai";
import type { Category, DonationFilters } from "@/types/donation.types";

export const donationFiltersAtom = atom<DonationFilters>({
  search: "",
  status: null,
  urgency: null,
  category: null,
});

export const selectedDonationIdAtom = atom<string | null>(null);

export const createDonationDialogOpenAtom = atom<boolean>(false);

export const deleteDonationDialogOpenAtom = atom<boolean>(false);
export const createCategoryDialogOpenAtom = atom<boolean>(false);
export const deleteCategoryDialogOpenAtom = atom<boolean>(false);
export const selectedCategoryIdAtom = atom<string | null>(null);
export const editCategoryDialogOpenAtom = atom<boolean>(false);
export const selectedCategoryForEditAtom = atom<Category | null>(null);

export const donationsPageAtom = atom<number>(1);

export const donationsPageSizeAtom = atom<number>(20);
