export type DonationStatus = "Active" | "Pending" | "Flagged";
export type DonationCategory = "Cooked" | "Bakery" | "Fresh" | "Dry";

export interface DonationItem {
  id: string;
  name: string;
  image: string;
  donor: {
    name: string;
    rating: number;
  };
  category: DonationCategory;
  status: DonationStatus;
  expiration: string;
}

export const mockDonations: DonationItem[] = [
  {
    id: "#DZ-9920",
    name: "Spicy Chicken Curry",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=64&auto=format&fit=crop",
    donor: { name: "Urban Kitchen", rating: 3 },
    category: "Cooked",
    status: "Flagged",
    expiration: "54m left",
  },
  {
    id: "#DZ-9918",
    name: "Artisan Sourdough",
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050eb0e9?q=80&w=64&auto=format&fit=crop",
    donor: { name: "Daily Bread Co.", rating: 4 },
    category: "Bakery",
    status: "Active",
    expiration: "4h 20m",
  },
  {
    id: "#DZ-9915",
    name: "Organic Fuji Apples",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6caa6?q=80&w=64&auto=format&fit=crop",
    donor: { name: "Green Mart", rating: 2 },
    category: "Fresh",
    status: "Pending",
    expiration: "2d left",
  },
  {
    id: "#DZ-9892",
    name: "Penne Pasta 10kg",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=64&auto=format&fit=crop",
    donor: { name: "Pasta Palace", rating: 5 },
    category: "Dry",
    status: "Active",
    expiration: "14d left",
  },
];
