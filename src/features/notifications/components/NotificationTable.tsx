import { CheckCircle2, Circle, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Notification } from "@/types/notification.types";

type NotificationTableProps = {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="px-6 py-4">
        <Skeleton className="h-4 w-36 bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-52 bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-6 w-20 rounded-full bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-14 bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-24 bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-24 bg-muted" />
      </TableCell>
      <TableCell className="text-right px-6 py-4">
        <Skeleton className="h-8 w-8 rounded-full bg-muted ml-auto" />
      </TableCell>
    </TableRow>
  );
}

export function NotificationTable({
  notifications,
  loading,
  onMarkAsRead,
  onDelete,
}: NotificationTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <Table>
        <caption className="sr-only">Notifications list and actions</caption>
        <TableHeader>
          <TableRow className="bg-transparent hover:bg-transparent border-b border-border/50">
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">
              Title
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Body
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Type
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Status
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Recipient
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Created
            </TableHead>
            <TableHead className="text-right text-xs font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
          ) : notifications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="p-6 text-center text-muted-foreground">
                No notifications found
              </TableCell>
            </TableRow>
          ) : (
            notifications.map((notification) => (
              <TableRow
                key={notification.id}
                className="hover:bg-muted/30 border-b border-border/50"
              >
                <TableCell className="px-6 py-4 text-sm font-semibold text-foreground">
                  {notification.title}
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {truncate(notification.body, 60)}
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="secondary">{notification.type}</Badge>
                </TableCell>
                <TableCell className="py-4">
                  {notification.isRead ? (
                    <span className="inline-flex items-center gap-1.5 text-success text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      Read
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Circle className="h-4 w-4" />
                      Unread
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {notification.receiverId}
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {formatDate(notification.createdAt)}
                </TableCell>
                <TableCell className="text-right px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                        aria-label={`Open actions for ${notification.title}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!notification.isRead && onMarkAsRead ? (
                        <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                          Mark as read
                        </DropdownMenuItem>
                      ) : null}
                      {onDelete ? (
                        <DropdownMenuItem
                          onClick={() => onDelete(notification.id)}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
