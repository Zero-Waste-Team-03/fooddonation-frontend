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
import { UserRole } from "@/gql/graphql";
import {
  ACCOUNT_STATUSES,
  accountStatusLabels,
  roleLabels,
  ROLES,
  USER_FILTER_LABELS,
  USER_VERIFICATION_STATUS_OPTIONS,
  UserVerificationStatus,
  userVerificationStatusLabels,
} from "@/constants/users.constants";
import type { UserFilters } from "@/types/user.types";

type UserFiltersProps = {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  totalCount: number;
  filteredCount: number;
};

export function UserFilters({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: UserFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

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
    filters.role,
    filters.status,
    filters.verificationStatus,
    onFiltersChange,
  ]);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.role !== null ||
    filters.status !== null ||
    filters.verificationStatus !== null;

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={USER_FILTER_LABELS.searchPlaceholder}
            className="h-10 pl-10 text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <Select
          value={filters.role ?? "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              role: value === "all" ? null : (value as UserRole),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-40 h-10">
            <SelectValue placeholder={USER_FILTER_LABELS.selectRole} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{USER_FILTER_LABELS.allRoles}</SelectItem>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {roleLabels[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value === "all" ? null : value,
            })
          }
        >
          <SelectTrigger className="w-full sm:w-44 h-10">
            <SelectValue placeholder={USER_FILTER_LABELS.selectAccountStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{USER_FILTER_LABELS.allAccountStatuses}</SelectItem>
            {ACCOUNT_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {accountStatusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.verificationStatus ?? "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              verificationStatus:
                value === "all" ? null : (value as UserVerificationStatus),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-44 h-10">
            <SelectValue placeholder={USER_FILTER_LABELS.selectVerificationStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {USER_FILTER_LABELS.allVerificationStatuses}
            </SelectItem>
            {USER_VERIFICATION_STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {userVerificationStatusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onFiltersChange({
                search: "",
                role: null,
                status: null,
                verificationStatus: null,
              })
            }
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            {USER_FILTER_LABELS.clear}
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {USER_FILTER_LABELS.showing}{" "}
        <span className="font-semibold text-foreground">{filteredCount}</span>{" "}
        {USER_FILTER_LABELS.of}{" "}
        <span className="font-semibold text-foreground">{totalCount}</span>{" "}
        {USER_FILTER_LABELS.users}
      </p>
    </div>
  );
}
