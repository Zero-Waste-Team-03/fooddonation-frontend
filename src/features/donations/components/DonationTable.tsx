import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { DonationStatusValues, DonationUrgencyValues } from "@/gql/graphql";
import type { Donation } from "@/types/donation.types";
import { donationStatusLabels, donationUrgencyLabels } from "./DonationFilters";

type DonationTableProps = {
  donations: Donation[];
  loading: boolean;
  onDelete: (donationId: string) => void;
  onView?: (donationId: string) => void;
};

function getStatusBadgeVariant(status: DonationStatusValues) {
  switch (status) {
    case DonationStatusValues.Published:
      return "success";
    case DonationStatusValues.Draft:
      return "secondary";
    case DonationStatusValues.Completed:
      return "info";
    case DonationStatusValues.Expired:
      return "destructive";
    case DonationStatusValues.Reserved:
      return "warning";
    default:
      return "secondary";
  }
}

function getUrgencyBadgeVariant(urgency: DonationUrgencyValues) {
  switch (urgency) {
    case DonationUrgencyValues.High:
      return "destructive";
    case DonationUrgencyValues.Medium:
      return "warning";
    case DonationUrgencyValues.Low:
      return "success";
    default:
      return "secondary";
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatLocation(donation: Donation): string {
  const city = donation.location?.city ?? "";
  const country = donation.location?.country ?? "";
  const neighborhood = donation.location?.neighborhood ?? "";
  const parts = [neighborhood, city, country].filter((p) => p.trim().length > 0);
  return parts.length ? parts.join(", ") : "—";
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="px-6 py-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40 bg-muted" />
          <Skeleton className="h-3 w-24 bg-muted" />
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32 bg-muted" />
          <Skeleton className="h-3 w-36 bg-muted" />
        </div>
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-6 w-20 bg-muted rounded-full" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-6 w-16 bg-muted rounded-full" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-20 bg-muted" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-20 bg-muted" />
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

export function DonationTable({
  donations,
  loading,
  onDelete,
  onView,
}: DonationTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <Table>
        <caption className="sr-only">
          Donation listings with donor, status, urgency, and dates
        </caption>
        <TableHeader>
          <TableRow className="bg-transparent hover:bg-transparent border-b border-border/50">
            <TableHead className="min-w-[140px] text-xs font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">
              Listing
            </TableHead>
            <TableHead className="min-w-[120px] text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Donor
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Status
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Urgency
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Category
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Location
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Created
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              Expires
            </TableHead>
            <TableHead className="text-right text-xs font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))
          ) : donations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="p-6 text-center text-muted-foreground">
                No donations found
              </TableCell>
            </TableRow>
          ) : (
            donations.map((donation) => (
              <TableRow
                key={donation.id}
                className="hover:bg-muted/30 border-b border-border/50"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3 max-w-[260px]">
                    <div className="h-11 w-11 shrink-0 rounded-full bg-muted border border-border/50 shadow-sm flex items-center justify-center overflow-hidden">
                      {donation.mainAttachment?.url ? (
                        <img
                          src={donation.mainAttachment.url}
                          alt={donation.title}
                          width={44}
                          height={44}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">
                          {donation.title.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-bold text-foreground text-sm line-clamp-2">
                        {donation.title}
                      </span>
                      <span className="text-xs text-muted-foreground tracking-wide line-clamp-1">
                        {donation.description}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-foreground text-sm">
                      {donation.user.displayName ?? "—"}
                    </span>
                    <span className="text-xs text-muted-foreground tracking-wide">
                      {donation.user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant={getStatusBadgeVariant(donation.status)}>
                    {donationStatusLabels[donation.status]}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant={getUrgencyBadgeVariant(donation.urgency)}>
                    {donationUrgencyLabels[donation.urgency]}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  {donation.category ? (
                    <div className="flex flex-col gap-0.5 max-w-[180px]">
                      <span className="text-sm font-medium text-foreground line-clamp-2">
                        {donation.category.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {formatLocation(donation)}
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {formatDate(donation.createdAt)}
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {formatDate(donation.expiryDate)}
                </TableCell>
                <TableCell className="text-right px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                        aria-label={`Open actions for ${donation.title}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView ? (
                        <DropdownMenuItem onClick={() => onView(donation.id)}>
                          View
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem
                        onClick={() => onDelete(donation.id)}
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
  );
}
