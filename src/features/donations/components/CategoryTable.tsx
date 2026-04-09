import { useMemo, useState } from "react";
import { MoreHorizontal, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category } from "@/types/donation.types";

type CategoryTableProps = {
  categories: Category[];
  loading: boolean;
  onDelete: (categoryId: string) => void;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="px-6 py-4">
        <Skeleton className="h-4 w-40 bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-6 w-20 bg-muted rounded-full" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-24 bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-24 bg-muted" />
      </TableCell>
      <TableCell className="text-right px-6 py-4">
        <Skeleton className="h-8 w-8 rounded-full bg-muted ml-auto" />
      </TableCell>
    </TableRow>
  );
}

export function CategoryTable({ categories, loading, onDelete }: CategoryTableProps) {
  const [search, setSearch] = useState("");
  const [sensitivity, setSensitivity] = useState<string>("all");

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return categories.filter((category) => {
      const matchesSearch = query.length === 0 || category.name.toLowerCase().includes(query);
      const matchesSensitivity = sensitivity === "all" || category.sensitivity === sensitivity;
      return matchesSearch && matchesSensitivity;
    });
  }, [categories, search, sensitivity]);

  const hasActiveFilters = search.trim().length > 0 || sensitivity !== "all";

  const getSensitivityVariant = (value: string) => {
    if (value === "HIGH") return "destructive" as const;
    if (value === "MEDIUM") return "warning" as const;
    return "success" as const;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by category name..."
            className="h-10 pl-10 text-sm"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select value={sensitivity} onValueChange={setSensitivity}>
          <SelectTrigger className="w-full sm:w-40 h-10">
            <SelectValue placeholder="Sensitivity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sensitivity</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setSensitivity("all");
            }}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filteredCategories.length}</span> of{" "}
        <span className="font-semibold text-foreground">{categories.length}</span> categories
      </p>
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <Table>
          <caption className="sr-only">Donation categories and actions</caption>
          <TableHeader>
            <TableRow className="bg-transparent hover:bg-transparent border-b border-border/50">
              <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">
                Name
              </TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
                Sensitivity
              </TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
                Created
              </TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
                Updated
              </TableHead>
              <TableHead className="text-right text-xs font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-6 text-center text-muted-foreground">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/30 border-b border-border/50">
                  <TableCell className="px-6 py-4 text-sm font-semibold text-foreground">
                    {category.name}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant={getSensitivityVariant(category.sensitivity)}>
                      {category.sensitivity}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-muted-foreground">
                    {formatDate(category.createdAt)}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-muted-foreground">
                    {formatDate(category.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                          aria-label={`Open actions for ${category.name}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onDelete(category.id)}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
