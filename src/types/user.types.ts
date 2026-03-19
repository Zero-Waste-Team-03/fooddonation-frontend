export type UserRole = "ADMIN" | "USER" | "FOOD_SAVER" | "INSTITUTIONAL";

export type UserStatus = "ACTIVE" | "DEACTIVATED" | "BANNED";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  reputationScore: number;
  createdAt: string;
};
