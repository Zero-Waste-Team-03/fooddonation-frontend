import type { ComponentType, ReactNode } from "react";
import {
  CalendarDays,
  CalendarX2,
  CheckCircle2,
  Clock,
  Globe,
  Hash,
  LocateFixed,
  MapPin,
  Paperclip,
  PenLine,
  ShieldAlert,
  ShieldCheck,
  Tag,
  User2,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, MapMarker, MarkerContent, useMap } from "@/components/ui/map";
import { Skeleton } from "@/components/ui/skeleton";
import { useDonationDetailQuery } from "@/gql/graphql";
import { DonationStatusValues, DonationUrgencyValues } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { donationUrgencyLabels } from "../components/DonationFilters";

export type DonationDetailPageProps = {
  donationId: string;
};

function getUrgencyBadgeVariant(urgency: DonationUrgencyValues) {
  switch (urgency) {
    case DonationUrgencyValues.High:
      return "destructive" as const;
    case DonationUrgencyValues.Medium:
      return "warning" as const;
    case DonationUrgencyValues.Low:
      return "success" as const;
    default:
      return "secondary" as const;
  }
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function getInitials(displayName: string | null | undefined, email: string): string {
  if (displayName) {
    const parts = displayName.split(" ");
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return email[0]?.toUpperCase() ?? "?";
}

type StepState = "completed" | "active" | "destructive" | "idle";

const TIMELINE_STEPS = [
  { key: "draft", label: "Draft", icon: PenLine },
  { key: "published", label: "Published", icon: Globe },
  { key: "handoff", label: "Reserved / Expired", icon: Clock },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
] as const;

type TimelineStepKey = (typeof TIMELINE_STEPS)[number]["key"];

function getActiveStepIndex(status: DonationStatusValues): number {
  switch (status) {
    case DonationStatusValues.Draft:
      return 0;
    case DonationStatusValues.Published:
      return 1;
    case DonationStatusValues.Reserved:
    case DonationStatusValues.Expired:
      return 2;
    case DonationStatusValues.Completed:
      return 3;
    default:
      return 0;
  }
}

function getStepState(stepIndex: number, status: DonationStatusValues): StepState {
  const activeIndex = getActiveStepIndex(status);
  if (stepIndex < activeIndex) return "completed";
  if (stepIndex === activeIndex) {
    if (status === DonationStatusValues.Expired) return "destructive";
    if (status === DonationStatusValues.Completed) return "completed";
    return "active";
  }
  return "idle";
}

function getHandoffLabel(status: DonationStatusValues): string {
  if (status === DonationStatusValues.Reserved) return "Reserved";
  if (status === DonationStatusValues.Expired) return "Expired";
  return "Reserved / Expired";
}

function getStepLabel(key: TimelineStepKey, status: DonationStatusValues): string {
  if (key === "handoff") return getHandoffLabel(status);
  return TIMELINE_STEPS.find((s) => s.key === key)?.label ?? key;
}

function DonationStatusTimeline({ status }: { status: DonationStatusValues }) {
  return (
    <div className="flex items-start">
      {TIMELINE_STEPS.map((step, index) => {
        const isLast = index === TIMELINE_STEPS.length - 1;
        const stepState = getStepState(index, status);
        const connectorShouldBeActive = stepState === "completed";
        const label = getStepLabel(step.key, status);

        const StepIcon = step.icon;
        const iconColorClass = cn(
          stepState === "completed" && "text-primary",
          stepState === "active" && "text-primary",
          stepState === "destructive" && "text-destructive",
          stepState === "idle" && "text-muted-foreground/30"
        );

        return (
          <div key={step.key} className={cn("flex items-start", !isLast && "flex-1 min-w-0")}>
            <div className="flex flex-col items-center gap-3 shrink-0">
              <StepIcon
                className={cn("h-8 w-8 mb-2 transition-colors", iconColorClass)}
                aria-hidden
              />
              <div
                className={cn(
                  "h-3 w-3 rounded-full border-2 transition-all",
                  stepState === "completed" && "border-primary bg-primary",
                  stepState === "active" && "border-primary bg-background ring-4 ring-primary/20",
                  stepState === "destructive" &&
                    "border-destructive bg-destructive ring-4 ring-destructive/20",
                  stepState === "idle" && "border-border bg-muted"
                )}
              />
              <span
                className={cn(
                  "max-w-[72px] text-center text-[12px] font-medium leading-tight",
                  stepState === "completed" && "text-primary",
                  stepState === "active" && "text-primary",
                  stepState === "destructive" && "text-destructive",
                  stepState === "idle" && "text-muted-foreground/40"
                )}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mt-[58px] h-px flex-1 mx-2",
                  connectorShouldBeActive ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function MapLocateButton({
  coordinates,
}: {
  coordinates: { latitude: number; longitude: number };
}) {
  const { map } = useMap();

  const handleLocate = () => {
    map?.flyTo({
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 13,
      duration: 800,
    });
  };

  return (
    <Button
      type="button"
      size="icon"
      className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full shadow-card"
      onClick={handleLocate}
      aria-label="Go to donation location"
    >
      <LocateFixed className="h-4 w-4" aria-hidden />
    </Button>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="text-sm font-medium text-foreground">{children}</div>
      </div>
    </div>
  );
}

export function DonationDetailPage({ donationId }: DonationDetailPageProps) {
  const { data, loading } = useDonationDetailQuery({
    variables: { id: donationId },
    fetchPolicy: "cache-and-network",
  });

  const donation = data?.donation ?? null;

  const coordinates =
    donation?.location?.latitude != null && donation?.location?.longitude != null
      ? {
          latitude: donation.location.latitude,
          longitude: donation.location.longitude,
        }
      : null;

  const locationParts = [
    donation?.location?.neighborhood,
    donation?.location?.city,
    donation?.location?.country,
  ].filter(Boolean) as string[];

  const urgencyBadge = donation ? (
    <Badge variant={getUrgencyBadgeVariant(donation.urgency)}>
      {donationUrgencyLabels[donation.urgency]}
    </Badge>
  ) : null;

  return (
    <PageWrapper
      title={donation?.title ?? "Donation detail"}
      titleSuffix={urgencyBadge}
      description="Donation details and metadata."
    >
      {loading && !donation ? (
        <div className="flex flex-col -mt-2 pb-8 gap-6">
          <Card className="rounded-2xl">
            <CardContent className="px-6 py-5">
              <div className="flex items-center">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={cn("flex items-center", i < 3 && "flex-1")}>
                    <Skeleton className="h-3 w-3 shrink-0 rounded-full" />
                    {i < 3 && <Skeleton className="mx-2 h-px flex-1" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_auto]">
            <Card className="rounded-2xl">
              <CardHeader>
                <Skeleton className="h-5 w-20" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
            <Skeleton className="h-56 w-56 shrink-0 rounded-2xl" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader>
                <Skeleton className="h-5 w-16" />
              </CardHeader>
              <CardContent className="space-y-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Skeleton className="h-[340px] rounded-xl" />
          </div>
        </div>
      ) : !donation ? (
        <p className="text-sm text-muted-foreground">Donation not found.</p>
      ) : (
        <div className="flex flex-col -mt-2 pb-8 gap-6">
          <Card className="rounded-2xl">
            <CardContent className="px-6 py-5">
              <DonationStatusTimeline status={donation.status} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_auto]">
            <Card className="rounded-2xl min-h-full">
              <CardHeader>
                <CardTitle className="text-base">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {donation.safetyChecklistCompleted ? (
                    <Badge variant="success" className="gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                      Safety checked
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="gap-1">
                      <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
                      Safety not confirmed
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{donation.description}</p>
              </CardContent>
            </Card>

            <div className="h-56 w-56 shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-sm">
              {donation.mainAttachment?.url ? (
                <img
                  src={donation.mainAttachment.url}
                  alt={donation.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                  <Paperclip className="h-8 w-8 text-muted-foreground/40" aria-hidden />
                  <p className="text-xs text-muted-foreground">No image</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <DetailRow icon={User2} label="Donor">
                  <span className="text-sm font-semibold text-foreground">
                    {donation.user.displayName ?? "—"}
                  </span>
                  <span className="text-muted-foreground"> ({donation.user.email})</span>
                </DetailRow>

                <DetailRow icon={Hash} label="Quantity">
                  {donation.quantity}
                </DetailRow>

                <DetailRow icon={CalendarDays} label="Created">
                  {formatDate(donation.createdAt)}
                </DetailRow>

                <DetailRow icon={CalendarX2} label="Expiry">
                  {formatDate(donation.expiryDate)}
                </DetailRow>

                <DetailRow icon={Tag} label="Category">
                  {donation.category?.name ?? "—"}
                </DetailRow>

                <DetailRow icon={Paperclip} label="Attachments">
                  {donation.attachmentIds.length
                    ? `${donation.attachmentIds.length} attachment(s)`
                    : "—"}
                </DetailRow>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              {coordinates ? (
                <div className="relative h-[340px] overflow-hidden rounded-xl border border-border">
                  <Map
                    center={[coordinates.longitude, coordinates.latitude]}
                    zoom={13}
                    className="absolute inset-0 min-h-full"
                  >
                    <MapMarker longitude={coordinates.longitude} latitude={coordinates.latitude}>
                      <MarkerContent />
                    </MapMarker>
                    <MapLocateButton coordinates={coordinates} />
                  </Map>
                </div>
              ) : (
                <div className="flex h-[340px] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-border bg-muted/50 opacity-50 pointer-events-none select-none">
                  <MapPin className="h-8 w-8 text-muted-foreground/60" aria-hidden />
                  <p className="text-sm text-muted-foreground">No location coordinates</p>
                </div>
              )}

              {locationParts.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 px-1">
                  {locationParts.map((part, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      {part}
                      {i < locationParts.length - 1 && (
                        <span className="opacity-40" aria-hidden>
                          ·
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
