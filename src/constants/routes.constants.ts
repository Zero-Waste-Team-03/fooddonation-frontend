export const APP_ROUTES = {
  Dashboard: "/dashboard",
  Users: "/users",
  Donations: "/donations",
  Reports: "/reports",
  Settings: "/settings",
  Login: "/login",
} as const;

export type AppRoutePath = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
