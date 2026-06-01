import { useAtom, useAtomValue } from "jotai";
import { Link } from "@tanstack/react-router";
import { BarChart2, Download, Gift, LayoutDashboard, LogOut, Settings2, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { APP_ROUTES } from "@/constants/routes.constants";
import {
  SIDEBAR_NAV_LABELS,
  SidebarNavItemId,
  sidebarNavItems,
} from "@/constants/navigation.constants";
import { GlobalExportDialog } from "@/components/export/GlobalExportDialog";
import { EXPORT_LABELS } from "@/constants/export.constants";
import { cn } from "@/lib/utils";
import { canAccessRestrictedRoute } from "@/lib/rolePermissions";
import { authUserAtom, globalExportDialogOpenAtom, sidebarCollapsedAtom } from "@/store/atoms";
import { useAuthContext } from "@/providers/AuthProvider";

const navIcons: Record<SidebarNavItemId, LucideIcon> = {
  [SidebarNavItemId.Overview]: LayoutDashboard,
  [SidebarNavItemId.UserManagement]: Users,
  [SidebarNavItemId.DonationMonitoring]: Gift,
  [SidebarNavItemId.ReportsAnalytics]: BarChart2,
  [SidebarNavItemId.Settings]: Settings2,
};

export function Sidebar() {
  const [collapsed] = useAtom(sidebarCollapsedAtom);
  const [exportDialogOpen, setExportDialogOpen] = useAtom(globalExportDialogOpenAtom);
  const authUser = useAtomValue(authUserAtom);
  const { logout } = useAuthContext();

  const visibleNavItems = sidebarNavItems.filter((item) => {
    if (!("restrictedRoute" in item)) {
      return true;
    }

    return canAccessRestrictedRoute(item.restrictedRoute, authUser?.role);
  });

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 flex h-full flex-col border-r border-sidebar-rail-border bg-card transition-[width] duration-200",
        collapsed ? "w-sidebar-collapsed" : "w-sidebar"
      )}
    >
      <div
        className={cn("flex flex-row items-center gap-3 p-6", collapsed && "justify-center px-4")}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary">
          <span className="font-display text-sm font-bold text-primary-foreground">G</span>
        </div>
        {!collapsed && (
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-display text-xl font-bold leading-none tracking-[-0.025em] text-primary">
              Gasp&apos;Zero
            </span>
            <span className="text-[10px] font-semibold leading-normal tracking-widest text-sidebar-subtitle uppercase">
              Admin Console
            </span>
          </div>
        )}
      </div>
      <nav className={cn("flex flex-1 flex-col gap-1 px-4 pb-4", collapsed && "items-center px-2")}>
        {visibleNavItems.map(({ id, label, to }) => {
          const Icon = navIcons[id];

          return (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === APP_ROUTES.Dashboard }}
              activeProps={{
                className:
                  "bg-nav-active text-nav-active-foreground [&_svg]:text-nav-active-foreground",
              }}
              inactiveProps={{
                className:
                  "bg-transparent text-sidebar-text hover:bg-accent hover:text-accent-foreground",
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-md py-2.5 pr-3 pl-3 text-sm font-medium transition-colors",
                collapsed && "w-10 justify-center px-0"
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-sidebar-section-border p-4">
        <div className="border-b border-sidebar-section-border pb-4 mb-4">
          <button
            type="button"
            onClick={() => setExportDialogOpen(true)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md py-2.5 pr-3 pl-3 text-sm font-medium text-sidebar-text transition-colors hover:bg-accent hover:text-accent-foreground",
              collapsed && "w-10 justify-center px-0"
            )}
            aria-label={EXPORT_LABELS.exportData}
          >
            <Download className="size-5 shrink-0" aria-hidden />
            {!collapsed && <span className="truncate">{EXPORT_LABELS.exportData}</span>}
          </button>
        </div>
        <button
          type="button"
          onClick={logout}
          className={cn(
            "flex w-full items-center gap-3 rounded-md py-2.5 pr-3 pl-3 text-sm font-medium text-sidebar-text transition-colors hover:bg-accent hover:text-accent-foreground",
            collapsed && "w-10 justify-center px-0"
          )}
          aria-label={SIDEBAR_NAV_LABELS.logout}
        >
          <LogOut className="size-5 shrink-0" aria-hidden />
          {!collapsed && <span className="truncate">{SIDEBAR_NAV_LABELS.logout}</span>}
        </button>
      </div>

      <GlobalExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />
    </aside>
  );
}
