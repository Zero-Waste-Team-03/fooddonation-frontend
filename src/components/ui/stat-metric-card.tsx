import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatBadgeVariant = "success" | "destructive" | "warning" | "info" | "neutral";

const badgeVariantMap: Record<StatBadgeVariant, "success" | "destructive" | "warning" | "info" | "secondary"> = {
  success: "success",
  destructive: "destructive",
  warning: "warning",
  info: "info",
  neutral: "secondary",
};

export type StatMetricCardProps = {
  label: string;
  value: string;
  deltaLabel?: string;
  icon?: LucideIcon;
  badgeVariant?: StatBadgeVariant;
  className?: string;
};

export function StatMetricCard({
  label,
  value,
  deltaLabel,
  icon: Icon,
  badgeVariant = "success",
  className,
}: StatMetricCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border bg-card shadow-card", className)}>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex flex-row items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="font-display text-2xl font-bold text-page-title">{value}</p>
          </div>
          {Icon ? (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </div>
          ) : null}
        </div>
        {deltaLabel ? (
          <Badge
            variant={badgeVariantMap[badgeVariant]}
            className="w-fit"
          >
            {deltaLabel}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function StatMetricCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden border-border bg-card shadow-card", className)}>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex flex-row items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="size-10 shrink-0 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </CardContent>
    </Card>
  );
}
