import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DonationStatusValues, DonationUrgencyValues } from "@/gql/graphql";
import type { DonationFilters } from "@/types/donation.types";

type DonationFiltersProps = {
  filters: DonationFilters;
  onFiltersChange: (filters: DonationFilters) => void;
  totalCount: number;
  filteredCount: number;
};

export const DONATION_STATUSES = [
  DonationStatusValues.Completed,
  DonationStatusValues.Draft,
  DonationStatusValues.Expired,
  DonationStatusValues.Published,
  DonationStatusValues.Reserved,
] as const;

export const DONATION_URGENCIES = [
  DonationUrgencyValues.High,
  DonationUrgencyValues.Medium,
  DonationUrgencyValues.Low,
] as const;

function formatStatusLabel(status: DonationStatusValues): string {
  return status
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

function formatUrgencyLabel(urgency: DonationUrgencyValues): string {
  return urgency.charAt(0) + urgency.slice(1).toLowerCase();
}

export const donationStatusLabels: Record<DonationStatusValues, string> = {
  [DonationStatusValues.Completed]: formatStatusLabel(DonationStatusValues.Completed),
  [DonationStatusValues.Draft]: formatStatusLabel(DonationStatusValues.Draft),
  [DonationStatusValues.Expired]: formatStatusLabel(DonationStatusValues.Expired),
  [DonationStatusValues.Published]: formatStatusLabel(DonationStatusValues.Published),
  [DonationStatusValues.Reserved]: formatStatusLabel(DonationStatusValues.Reserved),
};

export const donationUrgencyLabels: Record<DonationUrgencyValues, string> = {
  [DonationUrgencyValues.High]: formatUrgencyLabel(DonationUrgencyValues.High),
  [DonationUrgencyValues.Medium]: formatUrgencyLabel(DonationUrgencyValues.Medium),
  [DonationUrgencyValues.Low]: formatUrgencyLabel(DonationUrgencyValues.Low),
};

export function DonationFilters({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: DonationFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (searchInput === filters.search) {
      return;
    }

    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchInput });
    }, 300);
    return () => clearTimeout(timer);
  }, [
    searchInput,
    filters.search,
    filters.status,
    filters.urgency,
    filters.categoryId,
    onFiltersChange,
  ]);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== null ||
    filters.urgency !== null ||
    (filters.categoryId != null && filters.categoryId.trim() !== "");

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, id, or description..."
            className="h-10 pl-10 text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <Select
          value={filters.status ?? "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value === "all" ? null : (value as DonationStatusValues),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-40 h-10">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {DONATION_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {donationStatusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.urgency ?? "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              urgency: value === "all" ? null : (value as DonationUrgencyValues),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-40 h-10">
            <SelectValue placeholder="Select urgency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Urgency</SelectItem>
            {DONATION_URGENCIES.map((urgency) => (
              <SelectItem key={urgency} value={urgency}>
                {donationUrgencyLabels[urgency]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Category ID (optional)"
          className="h-10 text-sm w-full sm:max-w-xs"
          value={filters.categoryId ?? ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              categoryId: e.target.value.trim() === "" ? null : e.target.value,
            })
          }
        />

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onFiltersChange({
                search: "",
                status: null,
                urgency: null,
                categoryId: null,
              })
            }
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filteredCount}</span> of{" "}
        <span className="font-semibold text-foreground">{totalCount}</span> donations
      </p>
    </div>
  );
}
