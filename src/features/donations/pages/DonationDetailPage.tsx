import { PageWrapper } from "@/components/layout/PageWrapper";

export type DonationDetailPageProps = {
  donationId: string;
};

export function DonationDetailPage({ donationId }: DonationDetailPageProps) {
  return (
    <PageWrapper
      title="Donation detail"
      description={`Identifier ${donationId}.`}
    >
      <p className="text-sm text-muted-foreground">Donation detail integration pending.</p>
    </PageWrapper>
  );
}
