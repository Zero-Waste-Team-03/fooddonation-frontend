import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { ReportStatus, ReportTargetType } from "@/gql/graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReportFilters as ReportFiltersType } from "@/types/report.types";

type ReportFiltersProps = {
  filters: ReportFiltersType;
  onFiltersChange: (filters: ReportFiltersType) => void;
  totalCount: number;
  filteredCount: number;
};

const REPORT_STATUS_OPTIONS: ReportStatus[] = [
  ReportStatus.Open,
  ReportStatus.UnderReview,
  ReportStatus.Resolved,
  ReportStatus.Rejected,
];

const REPORT_TYPE_OPTIONS: ReportTargetType[] = [
  ReportTargetType.Donation,
  ReportTargetType.Message,
  ReportTargetType.User,
];

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}

export function ReportFilters({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: ReportFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    if (searchInput === filters.search) {
      return;
    }

    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchInput });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, filters, onFiltersChange]);

  const hasActiveFilters =
    filters.search !== "" || filters.status !== null || filters.type !== null;

  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by reporter or target..."
            className="h-10 pl-10 text-sm"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>

        <Select
          value={filters.status ?? "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value === "all" ? null : (value as ReportStatus),
            })
          }
        >
          <SelectTrigger className="h-10 w-full sm:w-44">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {REPORT_STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {formatEnumLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.type ?? "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              type: value === "all" ? null : (value as ReportTargetType),
            })
          }
        >
          <SelectTrigger className="h-10 w-full sm:w-44">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {REPORT_TYPE_OPTIONS.map((type) => (
              <SelectItem key={type} value={type}>
                {formatEnumLabel(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() =>
              onFiltersChange({
                search: "",
                status: null,
                type: null,
              })
            }
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filteredCount}</span> of{" "}
        <span className="font-semibold text-foreground">{totalCount}</span> reports
      </p>
    </div>
  );
}
