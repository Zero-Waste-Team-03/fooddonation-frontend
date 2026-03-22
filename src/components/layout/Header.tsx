import { useAtom } from "jotai";
import { Bell, PanelLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sidebarCollapsedAtom } from "@/store";

export function Header() {
  const [, setCollapsed] = useAtom(sidebarCollapsedAtom);

  return (
    <header className="flex h-header w-full shrink-0 items-center justify-between gap-8 border-b border-border bg-header-surface px-8 backdrop-blur-[12px]">
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
        <div className="relative min-w-0 flex-1 max-w-xl">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            readOnly
            placeholder="Search analytics, users or donations..."
            className="h-auto rounded-md border-0 bg-muted py-2.5 pr-4 pl-10 text-sm leading-[1.21]"
            aria-label="Search"
          />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
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
            <p className="text-sm font-medium text-page-title">Sarah Jenkins</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
          <div
            className="size-10 shrink-0 rounded-full border border-sidebar-rail-border bg-muted"
            aria-hidden
          />
        </div>
      </div>
    </header>
  );
}
