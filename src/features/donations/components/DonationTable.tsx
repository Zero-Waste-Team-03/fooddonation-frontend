import { Eye, CheckCircle, Trash2, Flag } from "lucide-react";
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
import { mockDonations, DonationStatus } from "../data/mockDonations";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: DonationStatus }) {
  if (status === "Active") {
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-semibold h-6 px-2.5">
        <span className="mr-1.5 size-1.5 rounded-full bg-emerald-500"></span>
        Active
      </Badge>
    );
  }
  if (status === "Flagged") {
    return (
      <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-100 font-semibold h-6 px-2.5">
        <span className="mr-1.5 size-1.5 rounded-full bg-rose-500"></span>
        Flagged
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-100 font-semibold h-6 px-2.5">
      <span className="mr-1.5 size-1.5 rounded-full bg-amber-500"></span>
      Pending
    </Badge>
  );
}

export function DonationTable() {
  return (
    <div className="rounded-3xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-transparent hover:bg-transparent border-b">
            <TableHead className="w-[300px] text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">Item Name</TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-4">Donor</TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-4">Category</TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-4">Status</TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-4">Expiration</TableHead>
            <TableHead className="text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockDonations.map((donation) => (
            <TableRow key={donation.id} className="hover:bg-muted/30 border-b">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="size-11 shrink-0 rounded-full overflow-hidden bg-muted border border-border/50">
                    <img src={donation.image} alt={donation.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-foreground text-[14px]">{donation.name}</span>
                    <span className="text-[11px] text-muted-foreground font-medium tracking-wide">ID: {donation.id}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="size-7 shrink-0 rounded-full overflow-hidden bg-primary/10 border border-border/50">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${donation.donor.name}`} alt={donation.donor.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-[13px] text-foreground">{donation.donor.name}</span>
                    <div className="flex text-emerald-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={cn("text-[8px]", i < donation.donor.rating ? "text-emerald-500" : "text-muted-foreground/30")}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="secondary" className="bg-muted text-muted-foreground font-semibold px-2.5 py-0 h-6 text-[11px] rounded-full border-none shadow-none">
                  {donation.category}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <StatusBadge status={donation.status} />
              </TableCell>
              <TableCell className="py-4">
                <span className={cn(
                  "font-bold text-[13px]",
                  donation.status === "Flagged" ? "text-rose-600" : "text-foreground"
                )}>
                  {donation.expiration}
                </span>
              </TableCell>
              <TableCell className="text-right px-6 py-4">
                <div className="flex items-center justify-end gap-1.5">
                  <Button variant="ghost" size="icon" className="size-8 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-full">
                    <Eye className="size-4" />
                  </Button>
                  {donation.status === "Flagged" ? (
                    <Button variant="ghost" size="icon" className="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full">
                      <CheckCircle className="size-4" />
                    </Button>
                  ) : donation.status === "Pending" ? (
                    <Button variant="ghost" size="icon" className="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full">
                      <CheckCircle className="size-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full">
                      <Flag className="size-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="size-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-full">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-transparent">
        <div className="text-[13px] text-muted-foreground">
          Showing <span className="font-bold text-foreground">1 - 10</span> of <span className="font-bold text-foreground">452</span> donations
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon" className="size-8 rounded-md border-border/50 text-muted-foreground" disabled>
            <span className="sr-only">Previous</span>
            &lt;
          </Button>
          <Button variant="default" size="sm" className="size-8 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold p-0 shadow-sm">1</Button>
          <Button variant="outline" size="sm" className="size-8 rounded-md text-muted-foreground font-semibold border-transparent hover:bg-muted/50 p-0">2</Button>
          <Button variant="outline" size="sm" className="size-8 rounded-md text-muted-foreground font-semibold border-transparent hover:bg-muted/50 p-0">3</Button>
          <span className="px-1 text-muted-foreground text-sm tracking-widest">...</span>
          <Button variant="outline" size="sm" className="size-8 rounded-md text-muted-foreground font-semibold border-transparent hover:bg-muted/50 p-0">45</Button>
          <Button variant="outline" size="icon" className="size-8 rounded-md border-border/50 text-foreground shadow-sm">
            <span className="sr-only">Next</span>
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
}
