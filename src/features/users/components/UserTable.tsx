import { Star, MoreHorizontal } from "lucide-react";
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
import { mockUsers, UserRole, UserStatus } from "../data/mockUsers";

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "DONOR") {
    return (
      <Badge variant="outline" className="bg-emerald-50/80 text-emerald-700 border-emerald-200/60 font-bold uppercase tracking-wider text-[10px] h-6 px-3 rounded-full shadow-sm">
        DONOR
      </Badge>
    );
  }
  if (role === "BENEFICIARY") {
    return (
      <Badge variant="outline" className="bg-blue-50/80 text-blue-600 border-blue-200/60 font-bold uppercase tracking-wider text-[10px] h-6 px-3 rounded-full shadow-sm">
        BENEFICIARY
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-orange-50/80 text-orange-600 border-orange-200/60 font-bold uppercase tracking-wider text-[10px] h-6 px-3 rounded-full shadow-sm">
      FOOD SAVER
    </Badge>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  if (status === "Active") {
    return (
      <Badge variant="outline" className="bg-emerald-50/80 text-emerald-600 border-emerald-200/60 font-semibold h-6 px-2.5 rounded-full shadow-sm">
        <span className="mr-1.5 size-1.5 rounded-full bg-emerald-500"></span>
        Active
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-rose-50/80 text-rose-600 border-rose-200/60 font-semibold h-6 px-2.5 rounded-full shadow-sm">
      <span className="mr-1.5 size-1.5 rounded-full bg-rose-500"></span>
      Suspended
    </Badge>
  );
}

export function UserTable() {
  return (
    <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-transparent hover:bg-transparent border-b border-border/50">
            <TableHead className="w-75 text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">Name & Email</TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-4">Role</TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-4">Reputation</TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-4">Join Date</TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-4">Status</TableHead>
            <TableHead className="text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-4 px-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockUsers.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/30 border-b border-border/50">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="size-11 shrink-0 rounded-full overflow-hidden bg-muted border border-border/50 shadow-sm">
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-foreground text-[14px]">{user.name}</span>
                    <span className="text-[13px] text-muted-foreground tracking-wide">{user.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <RoleBadge role={user.role} />
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-4.5 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                    <Star className="size-2.5 fill-orange-500" />
                  </div>
                  <span className="font-bold text-[13px] text-foreground">{user.reputation} pts</span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <span className="font-medium text-muted-foreground text-[13px]">
                  {user.joinDate}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell className="text-right px-6 py-4">
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted">
                  <MoreHorizontal className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-transparent mt-1">
        <div className="text-[13px] text-muted-foreground">
          Showing <span className="font-bold text-foreground">1</span> to <span className="font-bold text-foreground">10</span> of <span className="font-bold text-foreground">1,240</span> results
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" className="h-8 rounded-lg border border-border text-muted-foreground px-3 text-xs shadow-sm hover:bg-muted/50 transition-colors bg-card" disabled>
            Previous
          </Button>
          <Button variant="default" size="sm" className="size-8 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold p-0 shadow-sm transition-colors">1</Button>
          <Button variant="outline" size="sm" className="size-8 rounded-lg text-muted-foreground font-semibold border-transparent hover:bg-muted/50 p-0 hover:text-foreground transition-colors bg-transparent">2</Button>
          <Button variant="outline" size="sm" className="size-8 rounded-lg text-muted-foreground font-semibold border-transparent hover:bg-muted/50 p-0 hover:text-foreground transition-colors bg-transparent">3</Button>
          <span className="px-1 text-muted-foreground text-sm tracking-widest">...</span>
          <Button variant="outline" size="sm" className="size-8 rounded-lg text-muted-foreground font-semibold border-transparent hover:bg-muted/50 p-0 hover:text-foreground transition-colors bg-transparent">124</Button>
          <Button variant="outline" size="sm" className="h-8 rounded-lg border border-border text-foreground shadow-sm px-3 text-xs hover:bg-muted/50 transition-colors bg-card font-medium">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
