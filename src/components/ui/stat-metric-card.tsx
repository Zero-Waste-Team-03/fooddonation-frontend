import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";  

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
    <phantom-ui loading={true} animation="shimmer" stagger={0.05} fallback-radius={8}>
      <StatMetricCard
        label="Placeholder Label"
        value="0.00"
        deltaLabel="+0.0%"
        icon={Activity}
        className={className}
      />
    </phantom-ui>
  );
}
