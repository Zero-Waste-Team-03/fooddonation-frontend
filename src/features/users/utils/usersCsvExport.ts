import {
  ACCOUNT_STATUSES,
  accountStatusLabels,
  deriveUserVerificationStatus,
  ROLES,
  roleLabels,
  USER_TABLE_LABELS,
  userVerificationStatusLabels,
} from "@/constants/users.constants";
import { UserRole } from "@/gql/graphql";
import type { User } from "@/types/user.types";

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", dateFormatOptions).format(date);
}

function isKnownRole(role: string): role is (typeof ROLES)[number] {
  return (ROLES as readonly string[]).includes(role);
}

function formatRoleLabel(role: string): string {
  return isKnownRole(role) ? roleLabels[role as UserRole] : role;
}

function isKnownStatus(status: string): status is (typeof ACCOUNT_STATUSES)[number] {
  return (ACCOUNT_STATUSES as readonly string[]).includes(status);
}

function formatStatusLabel(status: string): string {
  return isKnownStatus(status) ? accountStatusLabels[status] : status;
}

function formatUserCell(user: User): string {
  const name = user.displayName ?? USER_TABLE_LABELS.emptyValue;
  return `${name} (${user.email})`;
}

function formatLocation(user: User): string {
  if (user.location?.city && user.location?.country) {
    return `${user.location.city}, ${user.location.country}`;
  }
  return USER_TABLE_LABELS.emptyValue;
}

export function getUsersCsvHeaders(): string[] {
  return [
    USER_TABLE_LABELS.user,
    USER_TABLE_LABELS.role,
    USER_TABLE_LABELS.accountStatus,
    USER_TABLE_LABELS.profileStatus,
    USER_TABLE_LABELS.reputation,
    USER_TABLE_LABELS.location,
    USER_TABLE_LABELS.joined,
  ];
}

export function mapUsersToCsvRows(users: User[]): string[][] {
  return users.map((user) => {
    const verificationStatus = deriveUserVerificationStatus(user);
    return [
      formatUserCell(user),
      formatRoleLabel(user.role),
      formatStatusLabel(user.status),
      userVerificationStatusLabels[verificationStatus],
      String(user.reputationScore),
      formatLocation(user),
      formatDate(user.createdAt),
    ];
  });
}
