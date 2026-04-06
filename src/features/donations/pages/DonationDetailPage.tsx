import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDonationDetailQuery } from "@/gql/graphql";
import { DonationStatusValues, DonationUrgencyValues } from "@/gql/graphql";
import { donationStatusLabels, donationUrgencyLabels } from "../components/DonationFilters";

export type DonationDetailPageProps = {
  donationId: string;
};

function getStatusBadgeVariant(status: DonationStatusValues) {
  switch (status) {
    case DonationStatusValues.Published:
      return "success";
    case DonationStatusValues.Draft:
      return "secondary";
    case DonationStatusValues.Completed:
      return "info";
    case DonationStatusValues.Expired:
      return "destructive";
    case DonationStatusValues.Reserved:
      return "warning";
    default:
      return "secondary";
  }
}

function getUrgencyBadgeVariant(urgency: DonationUrgencyValues) {
  switch (urgency) {
    case DonationUrgencyValues.High:
      return "destructive";
    case DonationUrgencyValues.Medium:
      return "warning";
    case DonationUrgencyValues.Low:
      return "success";
    default:
      return "secondary";
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function DonationDetailPage({ donationId }: DonationDetailPageProps) {
  const { data, loading } = useDonationDetailQuery({
    variables: { id: donationId },
    fetchPolicy: "cache-and-network",
  });

  const donation = data?.donation ?? null;

  return (
    <PageWrapper
      title={donation ? donation.title : "Donation detail"}
      description={donation ? "Donation details and metadata." : "Donation details and metadata."}
    >
      {loading ? (
        <div className="flex flex-col -mt-2 pb-8 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : !donation ? (
        <p className="text-sm text-muted-foreground">Donation not found.</p>
      ) : (
        <div className="flex flex-col -mt-2 pb-8 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(donation.status)}>
                      {donationStatusLabels[donation.status]}
                    </Badge>
                    <Badge variant={getUrgencyBadgeVariant(donation.urgency)}>
                      {donationUrgencyLabels[donation.urgency]}
                    </Badge>
                    {donation.category ? (
                      <Badge variant="secondary">{donation.category.name}</Badge>
                    ) : null}
                    {donation.safetyChecklistCompleted ? (
                      <Badge variant="success">Safety checked</Badge>
                    ) : (
                      <Badge variant="warning">Safety not confirmed</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{donation.description}</p>
                </div>
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-sm">
                  {donation.mainAttachment?.url ? (
                    <img
                      src={donation.mainAttachment.url}
                      alt={donation.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Donor</p>
                <p className="text-sm font-semibold text-foreground">
                  {donation.user.displayName ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground">{donation.user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quantity</p>
                <p className="text-sm font-semibold text-foreground">{donation.quantity}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Created</p>
                <p className="text-sm text-foreground">{formatDate(donation.createdAt)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Expiry</p>
                <p className="text-sm text-foreground">{formatDate(donation.expiryDate)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</p>
                <p className="text-sm text-foreground">{donation.category?.name ?? "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</p>
                {donation.location ? (
                  <p className="text-sm text-foreground">
                    {[donation.location.city, donation.location.country].filter(Boolean).join(", ") || "—"}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Attachments</p>
                <p className="text-sm text-muted-foreground">
                  {donation.attachmentIds.length
                    ? `${donation.attachmentIds.length} attachment(s)`
                    : "—"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageWrapper>
  );
}
