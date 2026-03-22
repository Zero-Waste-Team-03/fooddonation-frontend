import { PageWrapper } from "@/components/layout/PageWrapper";

export type UserDetailPageProps = {
  userId: string;
};

export function UserDetailPage({ userId }: UserDetailPageProps) {
  return (
    <PageWrapper
      title="User profile"
      description={`Identifier ${userId}.`}
    >
      <p className="text-sm text-muted-foreground">User detail integration pending.</p>
    </PageWrapper>
  );
}
