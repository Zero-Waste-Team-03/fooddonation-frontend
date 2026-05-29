import { Skeleton } from "@/components/ui/skeleton";
import { USER_TABLE_LABELS } from "@/constants/users.constants";

export type UserInfoDisplayData = {
  displayName?: string | null;
  email: string;
  avatar?: { url?: string | null } | null;
};

function getInitials(displayName: string | undefined | null, email: string) {
  if (displayName) {
    const parts = displayName.split(" ");
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return email[0]?.toUpperCase() ?? "";
}

type UserInfoDisplayProps = {
  user: UserInfoDisplayData;
};

export function UserInfoDisplay({ user }: UserInfoDisplayProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-muted shadow-sm">
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
        <span className="text-sm font-bold text-foreground">
          {user.displayName ?? USER_TABLE_LABELS.emptyValue}
        </span>
        <span className="text-xs tracking-wide text-muted-foreground">{user.email}</span>
      </div>
    </div>
  );
}

export function UserInfoSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-11 w-11 rounded-full bg-muted" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32 bg-muted" />
        <Skeleton className="h-3 w-40 bg-muted" />
      </div>
    </div>
  );
}
