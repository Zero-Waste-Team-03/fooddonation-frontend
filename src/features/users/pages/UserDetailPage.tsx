import { useFragment } from "@apollo/client/react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  UserAdminListFieldsFragmentDoc,
  type UserAdminListFieldsFragment,
} from "@/gql/graphql";
import { UserStatusBadge } from "../components/UserStatusBadge";

export type UserDetailPageProps = {
  userId: string;
};

export function UserDetailPage({ userId }: UserDetailPageProps) {
  const { data, complete } = useFragment<UserAdminListFieldsFragment>({
    fragment: UserAdminListFieldsFragmentDoc,
    fragmentName: "UserAdminListFields",
    from: {
      __typename: "User",
      id: userId,
    },
  });

  const profileStatusBadge = complete ? (
    <UserStatusBadge isFoodSaver={data.isFoodSaver} isVerified={data.isVerified} />
  ) : null;

  return (
    <PageWrapper
      title="User profile"
      description={`Identifier ${userId}.`}
      actions={profileStatusBadge}
    >
      <p className="text-sm text-muted-foreground">User detail integration pending.</p>
    </PageWrapper>
  );
}
