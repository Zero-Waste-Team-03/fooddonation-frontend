import { useAtom } from "jotai";
import { Link } from "@tanstack/react-router";
import {
  BarChart2,
  Gift,
  LayoutDashboard,
  MapPin,
  Settings2,
  ShieldCheck,
  Users,
  Flag,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { sidebarCollapsedAtom } from "@/store";

const navItems = [
  { label: "Overview", to: "/", icon: LayoutDashboard },
  { label: "User Management", to: "/users", icon: Users },
  { label: "Donation Monitoring", to: "/donations", icon: Gift },
  { label: "Moderation", to: "/moderation", icon: ShieldCheck },
  { label: "Zones", to: "/zones", icon: MapPin },
  { label: "Analytics", to: "/analytics", icon: BarChart2 },
  { label: "Reports & Analytics", to: "/reports", icon: Flag },
  { label: "Settings", to: "/settings", icon: Settings2 },
] as const;

export function Sidebar() {
  const [collapsed] = useAtom(sidebarCollapsedAtom);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 flex h-full flex-col border-r border-sidebar-rail-border bg-card transition-[width] duration-200",
        collapsed ? "w-sidebar-collapsed" : "w-sidebar"
      )}
    >
      <div
        className={cn(
          "flex flex-row items-center gap-3 p-6",
          collapsed && "justify-center px-4"
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary">
          <span className="font-display text-sm font-bold text-primary-foreground">
            G
          </span>
        </div>
        {!collapsed && (
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-display text-xl font-bold leading-none tracking-[-0.025em] text-primary">
              Gasp&apos;Zero
            </span>
            <span className="text-[10px] font-semibold leading-normal tracking-[0.1em] text-sidebar-subtitle uppercase">
              Admin Console
            </span>
          </div>
        )}
      </div>
      <nav
        className={cn(
          "flex flex-1 flex-col gap-1 px-4 pb-4",
          collapsed && "items-center px-2"
        )}
      >
        {navItems.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
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
        <div
          className={cn(
            "rounded-xl bg-accent p-4",
            collapsed && "hidden"
          )}
        >
          <p className="text-xs font-semibold text-primary">Impact Goal</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-progress-track">
            <div className="h-full w-[72%] rounded-full bg-primary" />
          </div>
          <p className="mt-2 text-[10px] leading-normal text-muted-foreground">
            7.2 tons / 10 tons goal
          </p>
        </div>
      </div>
    </aside>
  );
}
