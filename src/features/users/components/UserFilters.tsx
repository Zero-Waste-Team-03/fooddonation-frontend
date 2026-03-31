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
import type { UserFilters } from "@/types/user.types";

type UserFiltersProps = {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  totalCount: number;
  filteredCount: number;
};

export const ROLES = [
  UserRole.Administrator,
  UserRole.Organization,
  UserRole.Store,
  UserRole.User,
  UserRole.LocalAuthority,
] as const;
export const STATUSES = ["Active", "Suspended", "Banned", "Deactivated"] as const;

export const roleLabels: Record<UserRole, string> = {
  [UserRole.Administrator]: "Administrator",
  [UserRole.Organization]: "Organization",
  [UserRole.Store]: "Stores",
  [UserRole.User]: "Standard user",
  [UserRole.LocalAuthority]: "Local Authority",
};

export const statusLabels: Record<(typeof STATUSES)[number], string> = {
  Active: "Active",
  Suspended: "Suspended",
  Banned: "Banned",
  Deactivated: "Deactivated",
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
  }, [searchInput, filters.search, filters.role, filters.status, onFiltersChange]);

  const hasActiveFilters =
    filters.search !== "" || filters.role !== null || filters.status !== null;

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
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
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
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
          <SelectTrigger className="w-full sm:w-40 h-10">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onFiltersChange({ search: "", role: null, status: null })
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
        <span className="font-semibold text-foreground">{totalCount}</span> users
      </p>
    </div>
  );
}
