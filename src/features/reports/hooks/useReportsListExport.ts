import { useCallback, useState } from "react";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import { EXPORT_FILE_NAMES, EXPORT_LABELS } from "@/constants/export.constants";
import { downloadListCsv } from "@/lib/exportListCsv";
import { reportFiltersAtom, reportsPageSizeAtom } from "@/store/atoms/reports.atoms";
import type { Report } from "@/types/report.types";
import { fetchAllReports } from "../utils/fetchAllReports";
import { filterReportsBySearch } from "../utils/matchesReportSearchFilter";
import { getReportsCsvHeaders, mapReportsToCsvRows } from "../utils/reportsCsvExport";

export function useReportsListExport() {
  const filters = useAtomValue(reportFiltersAtom);
  const limit = useAtomValue(reportsPageSizeAtom);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runExport = useCallback((reports: Report[]) => {
    const headers = getReportsCsvHeaders();
    const rows = mapReportsToCsvRows(reports);
    downloadListCsv(headers, rows, EXPORT_FILE_NAMES.reports);
  }, []);

  const exportCurrentPage = useCallback(
    (reports: Report[]) => {
      setErrorMessage(null);
      try {
        runExport(reports);
      } catch {
        setErrorMessage(EXPORT_LABELS.exportFailed);
        toast.error(EXPORT_LABELS.exportFailed);
      }
    },
    [runExport]
  );

  const exportEntireList = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const allReports = await fetchAllReports(limit, filters);
      const filtered = filterReportsBySearch(allReports, filters.search);
      runExport(filtered);
    } catch {
      setErrorMessage(EXPORT_LABELS.exportFailed);
      toast.error(EXPORT_LABELS.exportFailed);
    } finally {
      setLoading(false);
    }
  }, [filters, limit, runExport]);

  return {
    loading,
    errorMessage,
    exportCurrentPage,
    exportEntireList,
  };
}
