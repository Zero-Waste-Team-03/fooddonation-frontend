import { Filter, Download, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DonationFilters() {
  return (
    <div className="mt-8 mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="h-10 rounded-full bg-card px-5 text-sm shadow-sm text-muted-foreground font-medium">
          <Filter className="mr-2 size-4" />
          Status: All
        </Button>
        <Button variant="outline" className="h-10 rounded-full bg-card px-5 text-sm shadow-sm text-muted-foreground font-medium">
          <Filter className="mr-2 size-4" />
          Category: All
        </Button>
        <Button variant="outline" className="h-10 rounded-full bg-card px-5 text-sm shadow-sm text-foreground font-semibold border-border">
          <AlertTriangle className="mr-2 size-4" />
          Urgency: High
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button className="h-10 rounded-full bg-primary hover:bg-primary/90 px-5 text-sm font-semibold shadow-sm text-primary-foreground">
          <Plus className="mr-2 size-4" />
          Manual Entry
        </Button>
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-card text-muted-foreground shadow-sm">
          <Download className="size-4" />
        </Button>
      </div>
    </div>
  );
}
