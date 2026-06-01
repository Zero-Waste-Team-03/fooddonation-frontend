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
import {
  DONATION_ACTION_LABELS,
  DONATION_TABLE_LABELS,
  canVerifyDonation,
} from "@/constants/donations.constants";
import type { Donation } from "@/types/donation.types";
import { formatDonationDate, formatDonationLocation } from "../utils/formatDonationDisplay";
import { donationStatusLabels, donationUrgencyLabels } from "./DonationFilters";

type DonationTableProps = {
  donations: Donation[];
  loading: boolean;
  onDelete: (donationId: string) => void;
  onView?: (donationId: string) => void;
  onVerify?: (donationId: string) => void;
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
    case DonationStatusValues.PendingApproval:
      return "warning";
    case DonationStatusValues.Rejected:
      return "destructive";
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
  onVerify,
}: DonationTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <Table>
        <caption className="sr-only">{DONATION_TABLE_LABELS.caption}</caption>
        <TableHeader>
          <TableRow className="bg-transparent hover:bg-transparent border-b border-border/50">
            <TableHead className="min-w-[140px] text-xs font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">
              {DONATION_TABLE_LABELS.listing}
            </TableHead>
            <TableHead className="min-w-[120px] text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              {DONATION_TABLE_LABELS.donor}
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              {DONATION_TABLE_LABELS.status}
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              {DONATION_TABLE_LABELS.urgency}
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              {DONATION_TABLE_LABELS.category}
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              {DONATION_TABLE_LABELS.location}
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              {DONATION_TABLE_LABELS.created}
            </TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-4">
              {DONATION_TABLE_LABELS.expires}
            </TableHead>
            <TableHead className="text-right text-xs font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">
              {DONATION_TABLE_LABELS.actions}
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
                {DONATION_TABLE_LABELS.empty}
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
                    <div className="max-w-[180px]">
                      <Badge variant="secondary" className="max-w-full truncate">
                        {donation.category.name}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {formatDonationLocation(donation)}
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {formatDonationDate(donation.createdAt)}
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {formatDonationDate(donation.expiryDate)}
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
                      {onVerify && canVerifyDonation(donation.status) ? (
                        <DropdownMenuItem onClick={() => onVerify(donation.id)}>
                          {DONATION_ACTION_LABELS.verify}
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
