import type {
  User as GqlUser,
  UserStats,
  PaginatedUsers,
  SendNotificationInput,
} from "@/gql/graphql";

export type { UserStats, PaginatedUsers, SendNotificationInput };

export type User = GqlUser;

export type UserFilters = {
  search: string;
  role: string | null;
  status: string | null;
};

export type UserAction = "suspend" | "activate" | "notify";

export type UpdateProfileFormValues = {
  displayName: string;
  email: string;
  description?: string;
  location: {
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    neighborhood?: string;
  };
  settings: {
    appearance: "DARK" | "LIGHT" | "SYSTEM";
    isNewDonationsAlertsEnabled: boolean;
    isSystemReports: boolean;
    isUrgentAlertsEnabled: boolean;
  };
};

export type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  logoutFromOtherDevices: boolean;
};
