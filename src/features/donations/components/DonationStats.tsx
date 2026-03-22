import { TrendingUp, AlertCircle, ClipboardList, ShoppingBag, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DonationStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Active Donations */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Active Donations
          </CardTitle>
          <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40">
            <ShoppingBag className="size-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tracking-tight text-foreground">
            452
          </div>
          <p className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
            <TrendingUp className="mr-1 size-3" />
            +12% from yesterday
          </p>
        </CardContent>
      </Card>

      {/* Flagged Items */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Flagged Items
          </CardTitle>
          <div className="flex size-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40">
            <AlertCircle className="size-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold tracking-tight text-foreground">
              8
            </div>
            <Badge variant="destructive" className="h-6 rounded-full px-2 text-[10px] uppercase font-bold tracking-wider bg-rose-100 text-rose-600 hover:bg-rose-100">
              URGENT
            </Badge>
          </div>
          <p className="mt-2 text-xs text-rose-500 font-medium">
            Requires immediate review
          </p>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pending Approvals
          </CardTitle>
          <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/40">
            <ClipboardList className="size-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tracking-tight text-foreground">
            15
          </div>
          <p className="mt-2 flex items-center text-xs text-amber-600 font-medium">
            <Clock className="mr-1 size-3" />
            Avg wait: 14 mins
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
