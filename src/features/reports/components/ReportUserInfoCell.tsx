import { useFragment } from "@apollo/client/react";
import {
  UserAdminListFieldsFragmentDoc,
  type UserAdminListFieldsFragment,
} from "@/gql/graphql";
import { UserInfoDisplay, type UserInfoDisplayData } from "@/features/users/components/UserInfoDisplay";
import { cn } from "@/lib/utils";

type ReportUserPartial = {
  displayName?: string | null;
  email?: string | null;
  avatar?: { url?: string | null } | null;
};

type ReportUserInfoCellProps = {
  userId: string;
  fallbackId: string;
  partialUser?: ReportUserPartial | null;
  className?: string;
  navigable?: boolean;
};

function toUserInfoDisplayData(partial: ReportUserPartial): UserInfoDisplayData | null {
  const email = partial.email;
  if (!email) {
    return null;
  }

  return {
    displayName: partial.displayName,
    email,
    avatar: partial.avatar ?? null,
  };
}

export function ReportUserInfoCell({
  userId,
  fallbackId,
  partialUser,
  className,
  navigable = false,
}: ReportUserInfoCellProps) {
  const { data, complete } = useFragment<UserAdminListFieldsFragment>({
    fragment: UserAdminListFieldsFragmentDoc,
    fragmentName: "UserAdminListFields",
    from: {
      __typename: "User",
      id: userId,
    },
  });

  if (complete) {
    return (
      <div className={className}>
        <UserInfoDisplay user={data} />
      </div>
    );
  }

  if (partialUser) {
    const displayData = toUserInfoDisplayData(partialUser);
    if (displayData) {
      return (
        <div className={className}>
          <UserInfoDisplay user={displayData} />
        </div>
      );
    }
  }

  return (
    <span
      className={cn(
        "text-sm",
        navigable
          ? "font-medium text-primary underline-offset-4 hover:underline"
          : "font-mono text-xs text-muted-foreground",
        className
      )}
    >
      {fallbackId}
    </span>
  );
}
