import { useEffect, useMemo, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { Bell, CheckCircle2, Monitor, Moon, PanelLeft, Sun, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { authUserAtom, notificationFiltersAtom, sidebarCollapsedAtom, themeAtom } from "@/store";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useNotificationActions } from "@/features/notifications/hooks/useNotificationActions";
import { roleLabels } from "@/features/users/components/UserFilters";
import { UserRole } from "@/types/user.types";

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
  const [notificationFilters, setNotificationFilters] = useAtom(notificationFiltersAtom);
  const authUser = useAtomValue(authUserAtom);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { notifications, loading, refetch } = useNotifications();
  const { handleDelete, handleMarkAsRead, handleMarkManyAsRead, loading: actionLoading } =
    useNotificationActions();

  const displayName = authUser?.displayName?.trim() || null;
  const email = authUser?.email ?? "";
  const role = authUser?.role?.trim() ?? "";
  const title = displayName || email || "Account";
  const subtitle = displayName ? roleLabels[role as UserRole] || email : roleLabels[role as UserRole];
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  useEffect(() => {
    if (!notificationsOpen) {
      return;
    }
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [notificationsOpen]);

  return (
    <header className="flex h-header w-full shrink-0 items-center justify-between gap-8 border-b border-border bg-header-surface px-8 backdrop-blur-md z-1000">
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
        <div className="relative" ref={panelRef}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 rounded-md relative"
            aria-label="Notifications"
            onClick={() => setNotificationsOpen((open) => !open)}
          >
            <Bell className="size-5" aria-hidden />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold inline-flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </Button>
          {notificationsOpen ? (
            <div className="absolute right-0 mt-2 w-[380px] max-w-[85vw] rounded-xl border bg-card shadow-dropdown z-1000 p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      const unreadIds = notifications
                        .filter((notification) => !notification.isRead)
                        .map((notification) => notification.id);
                      if (unreadIds.length > 0) {
                        void handleMarkManyAsRead(unreadIds).then(() => refetch());
                      }
                    }}
                    disabled={loading || actionLoading || unreadCount === 0}
                  >
                    Mark all read
                  </Button>
                </div>
              </div>
              <Input
                placeholder="Search notifications..."
                className="h-10 mb-3"
                value={notificationFilters.search}
                onChange={(event) =>
                  setNotificationFilters({
                    ...notificationFilters,
                    search: event.target.value,
                  })
                }
              />
              <div className="max-h-[360px] overflow-y-auto space-y-2">
                {loading ? (
                  <p className="text-sm text-muted-foreground py-2">Loading notifications...</p>
                ) : notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">No notifications found.</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="rounded-lg border border-border/60 p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.body}
                          </p>
                        </div>
                        <Badge variant={notification.isRead ? "secondary" : "warning"}>
                          {notification.isRead ? "Read" : "Unread"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-muted-foreground">{notification.type}</span>
                        <div className="flex items-center gap-1">
                          {!notification.isRead ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                void handleMarkAsRead(notification.id).then(() => refetch());
                              }}
                              disabled={actionLoading}
                              aria-label="Mark as read"
                            >
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            </Button>
                          ) : null}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              void handleDelete(notification.id).then(() => refetch());
                            }}
                            disabled={actionLoading}
                            aria-label="Delete notification"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
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
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-sidebar-rail-border bg-muted text-xs font-bold text-muted-foreground overflow-hidden"
            aria-hidden
          >
            {authUser?.avatar?.url ? (
              <img
                src={authUser.avatar.url}
                alt={displayName ?? email}
                className="w-full h-full object-cover"
              />
            ) : (
              profileInitials(authUser?.displayName, email)
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
