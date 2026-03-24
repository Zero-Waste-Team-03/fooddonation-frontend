import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatBadgeVariant = "success" | "destructive" | "warning" | "info" | "neutral";

const badgeVariantClass: Record<StatBadgeVariant, string> = {
  success: "bg-success/10 text-success",
  destructive: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  neutral: "bg-muted text-muted-foreground",
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
            className={cn("w-fit", badgeVariantClass[badgeVariant])}
          >
            {deltaLabel}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}
