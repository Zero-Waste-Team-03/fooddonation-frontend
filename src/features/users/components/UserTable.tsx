import {
  CheckCircle2,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/types/user.types";
import { roleLabels, ROLES, STATUSES, statusLabels } from "./UserFilters";

type UserTableProps = {
  users: User[];
  loading: boolean;
  onSuspend: (userId: string) => void;
  onActivate: (userId: string) => void;
  onSendNotification: (userId: string) => void;
};

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "Administrator":
      return "destructive";
    case "Local Authority":
      return "success";
    case "Organizations":
      return "info";
    case "Stores":
      return "warning";
    case "User":
      return "secondary";
    default:
      return "secondary";
  }
}

function formatRoleLabel(role: string) {
  return roleLabels[ROLES[ROLES.indexOf(role as any)]] ?? role;
}

function formatStatusLabel(status: string) {
  return statusLabels[STATUSES[STATUSES.indexOf(status as any)]] ?? status;
}

function getStatusBadgeVariant(status: string) {
  if (status === "Active") {
    return "success";
  }
  if (status === "Suspended" || status === "Banned") {
    return "destructive";
  }
  return "secondary";
}

function getInitials(displayName: string | undefined | null, email: string) {
  if (displayName) {
    const parts = displayName.split(" ");
    return (
      (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")
    ).toUpperCase();
  }
  return email[0].toUpperCase();
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="px-6 py-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-11 w-11 rounded-full bg-muted" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32 bg-muted" />
            <Skeleton className="h-3 w-40 bg-muted" />
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-6 w-16 bg-muted rounded-full" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-6 w-16 bg-muted rounded-full" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-12 bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-5 bg-muted" />
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

export function UserTable({
  users,
  loading,
  onSuspend,
  onActivate,
  onSendNotification,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <Table>
        <caption className="sr-only">
          Platform users with role, reputation, join date, and status
        </caption>
        <TableHeader>
          <TableRow className="bg-transparent hover:bg-transparent border-b border-border/50">
            <TableHead className="w-1/4 text-xs font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">
              User
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Role
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Status
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Reputation
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Verified
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Location
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Joined
            </TableHead>
            <TableHead className="text-right text-xs font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="p-6 text-center text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-muted/30 border-b border-border/50"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 rounded-full bg-muted border border-border/50 shadow-sm flex items-center justify-center overflow-hidden">
                      {user.avatarAttachmentId ? (
                        <img
                          src={`/api/attachments/${user.avatarAttachmentId}`}
                          alt={user.displayName ?? user.email}
                          width={44}
                          height={44}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">
                          {getInitials(user.displayName, user.email)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-foreground text-sm">
                        {user.displayName ?? "—"}
                      </span>
                      <span className="text-xs text-muted-foreground tracking-wide">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {formatRoleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant={getStatusBadgeVariant(user.status)}>
                    {formatStatusLabel(user.status)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-sm font-medium text-foreground">
                  {user.reputationScore}
                </TableCell>
                <TableCell className="py-4">
                  {user.isMailVerified ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {user.location?.city && user.location?.country
                    ? `${user.location.city}, ${user.location.country}`
                    : "—"}
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="text-right px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                        aria-label={`Open actions for ${user.displayName ?? user.email}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user.status === "Active" ? (
                        <DropdownMenuItem
                          onClick={() => onSuspend(user.id)}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          Suspend User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => onActivate(user.id)}
                          className="text-success focus:bg-success/10 focus:text-success"
                        >
                          Activate User
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onSendNotification(user.id)}
                      >
                        Send Notification
                      </DropdownMenuItem>
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
