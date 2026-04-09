import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NotificationFilters as NotificationFiltersState } from "@/store";
import type { Notification } from "@/types/notification.types";

type NotificationFiltersProps = {
  filters: NotificationFiltersState;
  onFiltersChange: (filters: NotificationFiltersState) => void;
  notifications: Notification[];
};

export function NotificationFilters({
  filters,
  onFiltersChange,
  notifications,
}: NotificationFiltersProps) {
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

  const typeOptions = useMemo(
    () => Array.from(new Set(notifications.map((item) => item.type))).sort(),
    [notifications]
  );

  const hasActiveFilters =
    filters.search !== "" || filters.type !== null || filters.isRead !== null;

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search title or body..."
            className="h-10 pl-10 text-sm"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <Select
          value={filters.type ?? "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              type: value === "all" ? null : value,
            })
          }
        >
          <SelectTrigger className="w-full sm:w-48 h-10">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {typeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={
            filters.isRead == null ? "all" : filters.isRead ? "read" : "unread"
          }
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              isRead: value === "all" ? null : value === "read",
            })
          }
        >
          <SelectTrigger className="w-full sm:w-40 h-10">
            <SelectValue placeholder="Read status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFiltersChange({ search: "", type: null, isRead: null })}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
