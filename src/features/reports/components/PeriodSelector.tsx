import { Button } from "@/components/ui/button";
import type { ReportPeriod } from "@/types/report.types";

type PeriodSelectorProps = {
  value: ReportPeriod;
  onChange: (period: ReportPeriod) => void;
};

const options: { label: string; value: ReportPeriod }[] = [
  { label: "Last week", value: "LAST_WEEK" },
  { label: "Last month", value: "LAST_MONTH" },
  { label: "Last year", value: "LAST_YEAR" },
];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-card p-0.5">
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <Button
            key={option.value}
            type="button"
            variant="ghost"
            onClick={() => onChange(option.value)}
            className={[
              "h-8 rounded-md px-3 text-sm",
              isActive
                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
