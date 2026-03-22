export type UserRole = "DONOR" | "BENEFICIARY" | "FOOD SAVER";
export type UserStatus = "Active" | "Suspended";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  avatar: string; // url
  role: UserRole;
  reputation: number; // points
  joinDate: string;
  status: UserStatus;
}

export const mockUsers: UserItem[] = [
  {
    id: "USR-001",
    name: "Elena Gilbert",
    email: "elena.g@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=64&auto=format&fit=crop",
    role: "DONOR",
    reputation: 1240,
    joinDate: "Oct 12, 2023",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Marcus Thorne",
    email: "marcus.t@web.co",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=64&auto=format&fit=crop",
    role: "BENEFICIARY",
    reputation: 45,
    joinDate: "Nov 03, 2023",
    status: "Suspended",
  },
  {
    id: "USR-003",
    name: "Sarah Jenkins",
    email: "sarah.j@testmail.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=64&auto=format&fit=crop",
    role: "FOOD SAVER",
    reputation: 312,
    joinDate: "Jan 15, 2024",
    status: "Active",
  },
];
