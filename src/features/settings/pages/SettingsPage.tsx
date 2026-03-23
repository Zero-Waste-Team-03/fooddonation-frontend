import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";

import { AccountProfileSection } from "../components/AccountProfileSection";
import { AppearanceSection } from "../components/AppearanceSection";
import { CommunityGamificationSection } from "../components/CommunityGamificationSection";
import { NotificationsSection } from "../components/NotificationsSection";
import { PlatformConfigurationSection } from "../components/PlatformConfigurationSection";
import { SecuritySection } from "../components/SecuritySection";

const accountProfileInitialValues = {
  fullName: "Alex Rivera",
  email: "alex.rivera@gaspzero.org",
  role: "Super Administrator - Access to all modules",
};

const platformConfigurationInitialValues = {
  defaultDonationExpirationHours: "48 Hours",
  communityCurrencyValue: "IMPACT_POINTS" as const,
  monthlyTargetKg: "1500",
  donationCountGoal: "500",
  communityGuidelinesPreview:
    "Gasp'Zero is built on trust and shared responsibility. By using this platform, you agree to prioritize hygiene and timely collection.",
};

const communityGamificationInitialValues = {
  automationMode: "AUTOMATIC" as const,
  pointsThreshold: "500",
  autoRevocationEnabled: true,
};

const securityInitialValues = {
  passwordHint: "Last changed 3 months ago",
};

const notificationsInitialValues = {
  newDonations: true,
  urgentAlerts: true,
  systemReports: false,
};

const appearanceInitialValues = {
  appearanceTheme: "ETHOS_LIGHT" as const,
};

export function SettingsPage() {
  return (
    <PageWrapper
      title="Settings"
      description="Manage your administrative preferences, security protocols, and platform-wide configurations from a central hub."
    >
      <div className="space-y-6 pb-20">
        <div className="grid min-w-0 grid-cols-1 items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-6">
            <AccountProfileSection
              initialValues={accountProfileInitialValues}
              onSubmit={async (data) => {
                console.log("Account profile submit", data);
              }}
            />
            <PlatformConfigurationSection
              initialValues={platformConfigurationInitialValues}
              onSubmit={async (data) => {
                console.log("Platform configuration submit", data);
              }}
            />
            <CommunityGamificationSection
              initialValues={communityGamificationInitialValues}
              onSubmit={async (data) => {
                console.log("Community gamification submit", data);
              }}
            />
          </div>

          <div className="min-w-0 space-y-6">
            <SecuritySection
              initialValues={securityInitialValues}
              onSubmit={async (data) => {
                console.log("Security submit", data);
              }}
            />
            <NotificationsSection
              initialValues={notificationsInitialValues}
              onSubmit={async (data) => {
                console.log("Notifications submit", data);
              }}
            />
            <AppearanceSection
              initialValues={appearanceInitialValues}
              onSubmit={async (data) => {
                console.log("Appearance submit", data);
              }}
            />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 -mx-[var(--page-padding-x)] border-t border-border bg-background/95 px-[var(--page-padding-x)] py-4 backdrop-blur">
          <div className="flex justify-end">
            <Button className="h-11 rounded-[20px] px-5">Save Changes</Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
