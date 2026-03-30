import { useAtom } from "jotai";
import { useAtomValue } from "jotai";
import { Bell, Monitor, Moon, PanelLeft, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authUserAtom, sidebarCollapsedAtom, themeAtom } from "@/store";

function profileInitials(displayName: string | null | undefined, email: string) {
  if (displayName?.trim()) {
    const parts = displayName.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "";
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return ((a + b).toUpperCase() || email[0]?.toUpperCase()) ?? "?";
  }
  return email[0]?.toUpperCase() ?? "?";
}

export function Header() {
  const [, setCollapsed] = useAtom(sidebarCollapsedAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const authUser = useAtomValue(authUserAtom);

  const displayName = authUser?.displayName?.trim() || null;
  const email = authUser?.email ?? "";
  const role = authUser?.role?.trim() ?? "";
  const title = displayName || email || "Account";
  const subtitle = displayName ? role || email : role;

  return (
    <header className="flex h-header w-full shrink-0 items-center justify-between gap-8 border-b border-border bg-header-surface px-8 backdrop-blur-md">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 rounded-md"
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed((c) => !c)}
        >
          <PanelLeft className="size-5" aria-hidden />
        </Button>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 rounded-md"
          aria-label="Toggle sidebar"
          onClick={() => setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light")}
        >
              {theme === "system" ? (
                <Monitor className="size-5" aria-hidden />
              ) : theme === "dark" ? (
                <Moon className="size-5" aria-hidden />
              ) : (
                <Sun className="size-5" aria-hidden />
              )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 rounded-md"
          aria-label="Notifications"
        >
          <Bell className="size-5" aria-hidden />
        </Button>
        <div className="hidden h-8 w-px bg-border sm:block" aria-hidden />
        <div className="hidden items-center gap-3 sm:flex">
          <div className="text-right">
            <p className="truncate text-sm font-medium text-page-title" title={title}>
              {title}
            </p>
            <p className="truncate text-xs text-muted-foreground" title={subtitle || undefined}>
              {subtitle || "—"}
            </p>
          </div>
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-sidebar-rail-border bg-muted text-xs font-bold text-muted-foreground"
            aria-hidden
          >
            {authUser ? profileInitials(authUser.displayName, email) : "—"}
          </div>
        </div>
      </div>
    </header>
  );
}
