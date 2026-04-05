import { atomWithStorage } from "jotai/utils";
export * from "./atoms/auth.atoms";
export * from "./atoms/settings.atoms";
export * from "./atoms/ui.atoms";
export * from "./atoms/users.atoms";
export * from "./atoms/donations.atoms";

export const sidebarCollapsedAtom = atomWithStorage<boolean>(
  "sidebar_collapsed",
  false
);
