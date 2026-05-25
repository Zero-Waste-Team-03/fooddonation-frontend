import { useAtomValue } from "jotai";
import type { ApolloCache } from "@apollo/client";
import { toast } from "sonner";
import {
  AdminReportsDocument,
  ReportStatus,
  type AdminReportsQuery,
  type AdminReviewReportMutation,
  useAdminReviewReportMutation,
} from "@/gql/graphql";
import {
  reportFiltersAtom,
  reportsPageAtom,
  reportsPageSizeAtom,
} from "@/store";
import { buildReportsQueryVariables } from "../utils/buildReportsQueryVariables";
import { parseReportError } from "../utils/parseReportError";

function updateReportsCacheAfterReview(
  cache: ApolloCache,
  reviewed: AdminReviewReportMutation["adminReviewReport"],
  listVariables: ReturnType<typeof buildReportsQueryVariables>
) {
  cache.updateQuery<AdminReportsQuery>(
    { query: AdminReportsDocument, variables: listVariables },
    (existing: AdminReportsQuery | null) => {
      if (!existing?.adminReports?.items) {
        return existing;
      }

      return {
        ...existing,
        adminReports: {
          ...existing.adminReports,
          items: existing.adminReports.items.map((item) =>
            item.id === reviewed.id ? { ...item, ...reviewed } : item
          ),
        },
      };
    }
  );
}

export function useReportActions() {
  const page = useAtomValue(reportsPageAtom);
  const limit = useAtomValue(reportsPageSizeAtom);
  const filters = useAtomValue(reportFiltersAtom);
  const listVariables = buildReportsQueryVariables(page, limit, filters);

  const [reviewReport, { loading }] = useAdminReviewReportMutation({
    update: (cache, { data }) => {
      if (!data?.adminReviewReport) {
        return;
      }

      updateReportsCacheAfterReview(cache, data.adminReviewReport, listVariables);
    },
    onError: (error) => {
      toast.error(parseReportError(error));
    },
  });

  const handleStatusChange = async (reportId: string, status: ReportStatus) => {
    await reviewReport({
      variables: {
        input: {
          reportId,
          status,
        },
      },
    });
  };

  return {
    handleStatusChange,
    loading,
  };
}
