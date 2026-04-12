import { useAtom } from "jotai";
import { Link } from "@tanstack/react-router";
import { BarChart2, Gift, LayoutDashboard, LogOut, Settings2, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { sidebarCollapsedAtom } from "@/store/atoms";
import { useAuthContext } from "@/providers/AuthProvider";

const navItems = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "User Management", to: "/users", icon: Users },
  { label: "Donation Monitoring", to: "/donations", icon: Gift },
  { label: "Reports & Analytics", to: "/reports", icon: BarChart2 },
  { label: "Settings", to: "/settings", icon: Settings2 },
] as const;

export function Sidebar() {
  const [collapsed] = useAtom(sidebarCollapsedAtom);
  const { logout } = useAuthContext();

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
        {navItems.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/dashboard" }}
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
        ))}
      </nav>
      <div className="mt-auto border-t border-sidebar-section-border p-4">
        <button
          type="button"
          onClick={logout}
          className={cn(
            "flex w-full items-center gap-3 rounded-md py-2.5 pr-3 pl-3 text-sm font-medium text-sidebar-text transition-colors hover:bg-accent hover:text-accent-foreground",
            collapsed && "w-10 justify-center px-0"
          )}
          aria-label="Logout"
        >
          <LogOut className="size-5 shrink-0" aria-hidden />
          {!collapsed && <span className="truncate">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
