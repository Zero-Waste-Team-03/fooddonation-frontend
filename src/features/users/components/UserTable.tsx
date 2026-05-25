import { MoreHorizontal } from "lucide-react";
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
import {
  ACCOUNT_STATUSES,
  accountStatusLabels,
  roleLabels,
  ROLES,
  USER_ACTION_LABELS,
  USER_TABLE_LABELS,
} from "@/constants/users.constants";
import type { User } from "@/types/user.types";
import { UserStatusBadge } from "./UserStatusBadge";

type UserTableProps = {
  users: User[];
  loading: boolean;
  onSuspend: (userId: string) => void;
  onActivate: (userId: string) => void;
  onSendNotification: (userId: string) => void;
  onToggleFoodSaver: (userId: string, currentIsFoodSaver: boolean) => void;
  onToggleVerification: (userId: string, currentIsVerified: boolean) => void;
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

function isKnownRole(role: string): role is (typeof ROLES)[number] {
  return (ROLES as readonly string[]).includes(role);
}

function formatRoleLabel(role: string) {
  return isKnownRole(role) ? roleLabels[role] : role;
}

function isKnownStatus(status: string): status is (typeof ACCOUNT_STATUSES)[number] {
  return (ACCOUNT_STATUSES as readonly string[]).includes(status);
}

function formatStatusLabel(status: string) {
  return isKnownStatus(status) ? accountStatusLabels[status] : status;
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
        <Skeleton className="h-6 w-20 bg-muted rounded-full" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-12 bg-muted" />
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
  onToggleFoodSaver,
  onToggleVerification,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <Table>
        <caption className="sr-only">{USER_TABLE_LABELS.caption}</caption>
        <TableHeader>
          <TableRow className="bg-transparent hover:bg-transparent border-b border-border/50">
            <TableHead className="w-1/4 text-xs font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">
              {USER_TABLE_LABELS.user}
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              {USER_TABLE_LABELS.role}
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              {USER_TABLE_LABELS.accountStatus}
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              {USER_TABLE_LABELS.profileStatus}
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              {USER_TABLE_LABELS.reputation}
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              {USER_TABLE_LABELS.location}
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              {USER_TABLE_LABELS.joined}
            </TableHead>
            <TableHead className="text-right text-xs font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">
              {USER_TABLE_LABELS.actions}
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
                {USER_TABLE_LABELS.empty}
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
                      {user.avatar?.url ? (
                        <img
                          src={user.avatar.url}
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
                        {user.displayName ?? USER_TABLE_LABELS.emptyValue}
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
                <TableCell className="py-4">
                  <UserStatusBadge
                    isFoodSaver={user.isFoodSaver}
                    isVerified={user.isVerified}
                  />
                </TableCell>
                <TableCell className="py-4 text-sm font-medium text-foreground">
                  {user.reputationScore}
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {user.location?.city && user.location?.country
                    ? `${user.location.city}, ${user.location.country}`
                    : USER_TABLE_LABELS.emptyValue}
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
                        aria-label={`${USER_TABLE_LABELS.openActions} ${user.displayName ?? user.email}`}
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
                          {USER_ACTION_LABELS.suspend}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => onActivate(user.id)}
                          className="text-success focus:bg-success/10 focus:text-success"
                        >
                          {USER_ACTION_LABELS.activate}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onSendNotification(user.id)}
                      >
                        {USER_ACTION_LABELS.sendNotification}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onToggleFoodSaver(user.id, user.isFoodSaver)}
                      >
                        {user.isFoodSaver
                          ? USER_ACTION_LABELS.removeFoodSaver
                          : USER_ACTION_LABELS.markFoodSaver}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onToggleVerification(user.id, user.isVerified)}
                      >
                        {user.isVerified
                          ? USER_ACTION_LABELS.revokeVerification
                          : USER_ACTION_LABELS.verifyUser}
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
