import { useCallback, useState } from "react";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import { EXPORT_FILE_NAMES, EXPORT_LABELS } from "@/constants/export.constants";
import { downloadListCsv } from "@/lib/exportListCsv";
import { userFiltersAtom, usersPageSizeAtom } from "@/store/atoms/users.atoms";
import type { User } from "@/types/user.types";
import { fetchAllUsers } from "../utils/fetchAllUsers";
import { filterUsersByVerification } from "../utils/filterUsersByVerification";
import { getUsersCsvHeaders, mapUsersToCsvRows } from "../utils/usersCsvExport";

export function useUsersListExport() {
  const filters = useAtomValue(userFiltersAtom);
  const limit = useAtomValue(usersPageSizeAtom);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runExport = useCallback((users: User[]) => {
    const headers = getUsersCsvHeaders();
    const rows = mapUsersToCsvRows(users);
    downloadListCsv(headers, rows, EXPORT_FILE_NAMES.users);
  }, []);

  const exportCurrentPage = useCallback(
    (users: User[]) => {
      setErrorMessage(null);
      try {
        runExport(users);
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
      const allUsers = await fetchAllUsers(limit, filters);
      const filtered = filterUsersByVerification(allUsers, filters.verificationStatus);
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
