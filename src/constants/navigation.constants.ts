import { APP_ROUTES } from "@/constants/routes.constants";
import { RestrictedRoute } from "@/lib/rolePermissions";

export const SIDEBAR_NAV_LABELS = {
  overview: "Overview",
  userManagement: "User Management",
  donationMonitoring: "Donation Monitoring",
  reportsAnalytics: "Reports & Analytics",
  settings: "Settings",
  logout: "Logout",
} as const;

export enum SidebarNavItemId {
  Overview = "overview",
  UserManagement = "userManagement",
  DonationMonitoring = "donationMonitoring",
  ReportsAnalytics = "reportsAnalytics",
  Settings = "settings",
}

type SidebarNavItemConfigBase = {
  id: SidebarNavItemId;
  label: string;
  restrictedRoute?: RestrictedRoute;
};

export const sidebarNavItems = [
  {
    id: SidebarNavItemId.Overview,
    label: SIDEBAR_NAV_LABELS.overview,
    to: APP_ROUTES.Dashboard,
  },
  {
    id: SidebarNavItemId.UserManagement,
    label: SIDEBAR_NAV_LABELS.userManagement,
    to: APP_ROUTES.Users,
    restrictedRoute: RestrictedRoute.UsersManagement,
  },
  {
    id: SidebarNavItemId.DonationMonitoring,
    label: SIDEBAR_NAV_LABELS.donationMonitoring,
    to: APP_ROUTES.Donations,
  },
  {
    id: SidebarNavItemId.ReportsAnalytics,
    label: SIDEBAR_NAV_LABELS.reportsAnalytics,
    to: APP_ROUTES.Reports,
    restrictedRoute: RestrictedRoute.ReportsAnalytics,
  },
  {
    id: SidebarNavItemId.Settings,
    label: SIDEBAR_NAV_LABELS.settings,
    to: APP_ROUTES.Settings,
  },
] as const satisfies readonly (SidebarNavItemConfigBase & { to: string })[];
