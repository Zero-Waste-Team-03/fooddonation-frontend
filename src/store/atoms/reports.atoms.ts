import { atom } from "jotai";
import type { ReportFilters, ReportPeriod } from "@/types/report.types";

export const reportPeriodAtom = atom<ReportPeriod>("LAST_MONTH");

export const reportFiltersAtom = atom<ReportFilters>({
  search: "",
  status: null,
  type: null,
});

export const selectedReportIdAtom = atom<string | null>(null);

export const reportsPageAtom = atom<number>(1);

export const reportsPageSizeAtom = atom<number>(20);