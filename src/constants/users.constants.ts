import { UserRole } from "@/gql/graphql";

export const USER_FILTER_LABELS = {
  searchPlaceholder: "Search by name or email...",
  selectRole: "Select role",
  selectAccountStatus: "Select account status",
  selectVerificationStatus: "Select profile status",
  allRoles: "All Roles",
  allAccountStatuses: "All Account Statuses",
  allVerificationStatuses: "All Profile Statuses",
  clear: "Clear",
  showing: "Showing",
  of: "of",
  users: "users",
} as const;

export const USER_TABLE_LABELS = {
  user: "User",
  role: "Role",
  accountStatus: "Status",
  profileStatus: "Profile status",
  reputation: "Reputation",
  location: "Location",
  joined: "Joined",
  actions: "Actions",
  empty: "No users found",
  emptyValue: "—",
  caption: "Platform users with role, reputation, join date, and status",
  openActions: "Open actions for",
} as const;

export const USER_ACTION_LABELS = {
  suspend: "Suspend User",
  activate: "Activate User",
  sendNotification: "Send Notification",
  markFoodSaver: "Mark as Food Saver",
  removeFoodSaver: "Remove Food Saver",
  verifyUser: "Verify User",
  revokeVerification: "Revoke Verification",
} as const;

export const ROLES = [
  UserRole.Administrator,
  UserRole.Organization,
  UserRole.Store,
  UserRole.User,
  UserRole.LocalAuthority,
] as const;

export const ACCOUNT_STATUSES = ["Active", "Suspended", "Banned", "Deactivated"] as const;

export const roleLabels: Record<UserRole, string> = {
  [UserRole.Administrator]: "Administrator",
  [UserRole.Organization]: "Organization",
  [UserRole.Store]: "Stores",
  [UserRole.User]: "Standard user",
  [UserRole.LocalAuthority]: "Local Authority",
};

export const accountStatusLabels: Record<(typeof ACCOUNT_STATUSES)[number], string> = {
  Active: "Active",
  Suspended: "Suspended",
  Banned: "Banned",
  Deactivated: "Deactivated",
};

export enum UserVerificationStatus {
  FoodSaver = "foodSaver",
  Verified = "verified",
  Unverified = "unverified",
}

export const USER_VERIFICATION_STATUS_OPTIONS = [
  UserVerificationStatus.FoodSaver,
  UserVerificationStatus.Verified,
  UserVerificationStatus.Unverified,
] as const;

export const userVerificationStatusLabels: Record<UserVerificationStatus, string> = {
  [UserVerificationStatus.FoodSaver]: "Food Saver",
  [UserVerificationStatus.Verified]: "Verified",
  [UserVerificationStatus.Unverified]: "Unverified",
};

export function deriveUserVerificationStatus(user: {
  isFoodSaver: boolean;
  isVerified: boolean;
}): UserVerificationStatus {
  if (user.isFoodSaver) {
    return UserVerificationStatus.FoodSaver;
  }

  if (user.isVerified) {
    return UserVerificationStatus.Verified;
  }

  return UserVerificationStatus.Unverified;
}

export function userVerificationStatusBadgeVariant(
  status: UserVerificationStatus
): "success" | "info" | "secondary" {
  if (status === UserVerificationStatus.FoodSaver) {
    return "success";
  }

  if (status === UserVerificationStatus.Verified) {
    return "info";
  }

  return "secondary";
}

export function matchesVerificationStatusFilter(
  user: { isFoodSaver: boolean; isVerified: boolean },
  verificationStatus: UserVerificationStatus | null
): boolean {
  if (verificationStatus === null) {
    return true;
  }

  return deriveUserVerificationStatus(user) === verificationStatus;
}
