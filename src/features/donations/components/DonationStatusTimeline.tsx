import {
  CalendarX,
  CheckCircle2,
  Clock,
  Globe,
  PenLine,
  XCircle,
} from "lucide-react";
import type { ComponentType } from "react";
import {
  DonationStatusValues,
  type DonationDetailQuery,
} from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { CountdownRing } from "./CountdownRing";

type Donation = NonNullable<DonationDetailQuery["donation"]>;

type DonationStatusTimelineProps = {
  donation: Donation;
  refetch?: () => void;
};

type StepState = "completed" | "active" | "destructive" | "pending";

type StatusStep = {
  status: DonationStatusValues;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const STATUS_STEPS: readonly StatusStep[] = [
  { status: DonationStatusValues.Draft, label: "Draft", icon: PenLine },
  { status: DonationStatusValues.Published, label: "Published", icon: Globe },
  { status: DonationStatusValues.Reserved, label: "Reserved", icon: Clock },
  { status: DonationStatusValues.Completed, label: "Completed", icon: CheckCircle2 },
] as const;

const EXPIRED_STEP: StatusStep = {
  status: DonationStatusValues.Expired,
  label: "Expired",
  icon: XCircle,
};

function getLinearStepState(stepIndex: number, status: DonationStatusValues): StepState {
  if (status === DonationStatusValues.Expired) {
    if (stepIndex <= 2) return "completed";
    return "pending";
  }

  const activeIndex = (() => {
    switch (status) {
      case DonationStatusValues.Draft:
        return 0;
      case DonationStatusValues.Published:
        return 1;
      case DonationStatusValues.Reserved:
        return 2;
      case DonationStatusValues.Completed:
        return 3;
      default:
        return 0;
    }
  })();

  if (stepIndex < activeIndex) return "completed";
  if (stepIndex === activeIndex) {
    if (status === DonationStatusValues.Completed) return "completed";
    return "active";
  }
  return "pending";
}

function getExpiredState(status: DonationStatusValues): StepState {
  if (status === DonationStatusValues.Expired) return "destructive";
  return "pending";
}

function getStepTone(stepState: StepState) {
  return {
    icon: cn(
      stepState === "completed" && "text-primary",
      stepState === "active" && "text-primary",
      stepState === "destructive" && "text-destructive",
      stepState === "pending" && "text-muted-foreground/40"
    ),
    dot: cn(
      "h-3 w-3 rounded-full border-2 transition-all",
      stepState === "completed" && "border-primary bg-primary",
      stepState === "active" && "border-primary bg-background ring-4 ring-primary/20",
      stepState === "destructive" && "border-destructive bg-destructive ring-4 ring-destructive/20",
      stepState === "pending" && "border-border bg-muted"
    ),
    label: cn(
      "text-center text-[12px] font-medium leading-tight",
      stepState === "completed" && "text-primary",
      stepState === "active" && "text-primary",
      stepState === "destructive" && "text-destructive",
      stepState === "pending" && "text-muted-foreground/50"
    ),
  };
}

export function DonationStatusTimeline({ donation, refetch }: DonationStatusTimelineProps) {
  const expiredState = getExpiredState(donation.status);
  const expiredTone = getStepTone(expiredState);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-1">
          <div className="flex items-start">
            {STATUS_STEPS.map((step, index) => {
              const isLast = index === STATUS_STEPS.length - 1;
              const stepState = getLinearStepState(index, donation.status);
              const tone = getStepTone(stepState);
              const Icon = step.icon;

              return (
                <div
                  key={step.status}
                  className={cn("flex items-start", !isLast && "flex-1 min-w-0")}
                >
                  <div className="flex shrink-0 flex-col items-center gap-3">
                    <Icon className={cn("mb-2 h-8 w-8 transition-colors", tone.icon)} aria-hidden />
                    <div className={tone.dot} />
                    <span className={cn("max-w-[72px]", tone.label)}>{step.label}</span>
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "mx-2 mt-[58px] h-px flex-1",
                        stepState === "completed" ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex w-full items-start justify-center md:w-auto">
          <div className="flex shrink-0 flex-col items-center gap-3">
            <EXPIRED_STEP.icon className={cn("mb-2 h-8 w-8 transition-colors", expiredTone.icon)} aria-hidden />
            <div className={expiredTone.dot} />
            <span className={cn("max-w-[72px]", expiredTone.label)}>{EXPIRED_STEP.label}</span>
          </div>
        </div>
      </div>

      {donation.status === DonationStatusValues.Reserved && (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-6">
          <p className="mb-2 text-sm font-medium text-foreground">Reservation window</p>
          <CountdownRing
            expiresAt={donation.listingExpiresAt}
            totalDurationSeconds={7200}
            size={160}
            strokeWidth={10}
            onExpire={refetch}
          />
          <p className="max-w-[220px] text-center text-xs text-muted-foreground">
            The beneficiary has 2 hours to collect this donation after reserving it.
          </p>
        </div>
      )}

      {(donation.status === DonationStatusValues.Draft ||
        donation.status === DonationStatusValues.Published) &&
        donation.expiryDate && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarX className="h-4 w-4 shrink-0" />
            <span>
              Listing expires{" "}
              {new Intl.DateTimeFormat("en", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(donation.expiryDate))}
            </span>
          </div>
        )}
    </div>
  );
}
