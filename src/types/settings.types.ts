export type AccountProfileSettings = {
  fullName: string;
  email: string;
  role: string;
};

export type PlatformConfigurationSettings = {
  defaultDonationExpirationHours: string;
  communityCurrencyValue: "IMPACT_POINTS" | "GREEN_CREDITS";
  monthlyTargetKg: string;
  donationCountGoal: string;
  communityGuidelinesPreview: string;
};

export type CommunityGamificationSettings = {
  automationMode: "MANUAL" | "AUTOMATIC";
  pointsThreshold: string;
  autoRevocationEnabled: boolean;
};

export type SecuritySettings = {
  passwordHint: string;
};

export type NotificationSettings = {
  newDonations: boolean;
  urgentAlerts: boolean;
  systemReports: boolean;
};

export type AppearanceSettings = {
  appearanceTheme: "ETHOS_LIGHT" | "FOREST_DARK";
};
