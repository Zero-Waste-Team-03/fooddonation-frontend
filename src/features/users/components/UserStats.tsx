import { Users, HeartHandshake, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Users */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[13px] font-medium text-muted-foreground">
            Total Users
          </CardTitle>
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800">
            <Users className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-[28px] font-bold tracking-tight text-foreground">
              1,240
            </div>
            <p className="flex items-center text-[11px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100/50">
              <TrendingUp className="mr-0.5 size-3" />
              12%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Donors */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[13px] font-medium text-muted-foreground">
            Active Donors
          </CardTitle>
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800">
            <HeartHandshake className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-[28px] font-bold tracking-tight text-foreground">
              856
            </div>
            <p className="flex items-center text-[11px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100/50">
              <TrendingUp className="mr-0.5 size-3" />
              5%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reported Issues */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[13px] font-medium text-muted-foreground">
            Reported Issues
          </CardTitle>
          <div className="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500 dark:bg-rose-900/40 border border-rose-100 dark:border-rose-800">
            <AlertTriangle className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-[28px] font-bold tracking-tight text-foreground">
              12
            </div>
            <p className="flex items-center text-[11px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100/50">
              <TrendingDown className="mr-0.5 size-3" />
              2%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
