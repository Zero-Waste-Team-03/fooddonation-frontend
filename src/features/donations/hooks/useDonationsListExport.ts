import { useCallback, useState } from "react";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import { EXPORT_FILE_NAMES, EXPORT_LABELS } from "@/constants/export.constants";
import { downloadListCsv } from "@/lib/exportListCsv";
import { donationFiltersAtom, donationsPageSizeAtom } from "@/store";
import type { Donation } from "@/types/donation.types";
import {
  getDonationsCsvHeaders,
  mapDonationsToCsvRows,
} from "../utils/donationsCsvExport";
import { fetchAllDonations } from "../utils/fetchAllDonations";
import { filterDonationsBySearch } from "../utils/matchesDonationSearchFilter";

export function useDonationsListExport() {
  const filters = useAtomValue(donationFiltersAtom);
  const limit = useAtomValue(donationsPageSizeAtom);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runExport = useCallback((donations: Donation[]) => {
    const headers = getDonationsCsvHeaders();
    const rows = mapDonationsToCsvRows(donations);
    downloadListCsv(headers, rows, EXPORT_FILE_NAMES.donations);
  }, []);

  const exportCurrentPage = useCallback(
    (donations: Donation[]) => {
      setErrorMessage(null);
      try {
        runExport(donations);
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
      const allDonations = await fetchAllDonations(limit, filters);
      const filtered = filterDonationsBySearch(allDonations, filters.search);
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
