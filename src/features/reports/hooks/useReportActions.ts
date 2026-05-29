import { useState } from "react";
import { useAtomValue } from "jotai";
import type { ApolloCache } from "@apollo/client";
import { toast } from "sonner";
import {
  AdminReportsDocument,
  ReportStatus,
  UserAdminListFieldsFragmentDoc,
  type AdminReportsQuery,
  type AdminReviewReportMutation,
  type SuspendUserMutation,
  useAdminReviewReportMutation,
  useSuspendUserMutation,
} from "@/gql/graphql";
import {
  reportActionToStatus,
  ReportAction,
} from "@/constants/reports.constants";
import {
  reportFiltersAtom,
  reportsPageAtom,
  reportsPageSizeAtom,
} from "@/store";
import { parseUserActionError, type UserActionErrorMessage } from "@/features/users/utils/parseUserActionError";
import type { Report } from "@/types/report.types";
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

function updateUserCacheAfterSuspend(
  cache: ApolloCache,
  suspended: SuspendUserMutation["suspendUser"]
) {
  const cacheId = cache.identify({ __typename: "User", id: suspended.id });
  if (!cacheId) {
    return;
  }

  cache.modify({
    id: cacheId,
    fields: {
      status(existing: string) {
        return suspended.status ?? existing;
      },
      displayName(existing: string | null | undefined) {
        return suspended.displayName ?? existing;
      },
      email(existing: string) {
        return suspended.email ?? existing;
      },
    },
  });

  const existingFragment = cache.readFragment({
    id: cacheId,
    fragment: UserAdminListFieldsFragmentDoc,
    fragmentName: "UserAdminListFields",
  });

  if (existingFragment) {
    cache.writeFragment({
      id: cacheId,
      fragment: UserAdminListFieldsFragmentDoc,
      fragmentName: "UserAdminListFields",
      data: {
        ...existingFragment,
        status: suspended.status,
        displayName: suspended.displayName,
        email: suspended.email,
      },
    });
  }
}

export function useReportActions() {
  const page = useAtomValue(reportsPageAtom);
  const limit = useAtomValue(reportsPageSizeAtom);
  const filters = useAtomValue(reportFiltersAtom);
  const listVariables = buildReportsQueryVariables(page, limit, filters);
  const [banErrorMessage, setBanErrorMessage] = useState<UserActionErrorMessage | null>(null);

  const [reviewReport, { loading: reviewing }] = useAdminReviewReportMutation({
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

  const [suspendUser, { loading: suspending }] = useSuspendUserMutation({
    update: (cache, { data }) => {
      if (!data?.suspendUser) {
        return;
      }

      updateUserCacheAfterSuspend(cache, data.suspendUser);
    },
  });

  const handleReview = async (reportId: string, status: ReportStatus) => {
    await reviewReport({
      variables: {
        input: {
          reportId,
          status,
        },
      },
    });
  };

  const handleReportAction = async (report: Report, action: ReportAction) => {
    if (action === ReportAction.BanUser) {
      return;
    }

    const status = reportActionToStatus(action);
    if (!status) {
      return;
    }

    await handleReview(report.id, status);
  };

  const handleBanUser = async (report: Report): Promise<boolean> => {
    setBanErrorMessage(null);

    try {
      const suspendResult = await suspendUser({
        variables: { userId: report.targetId },
      });

      if (!suspendResult.data?.suspendUser) {
        return false;
      }
    } catch (error) {
      const message = parseUserActionError(error);
      setBanErrorMessage(message);
      toast.error(message);
      return false;
    }

    const reviewResult = await reviewReport({
      variables: {
        input: {
          reportId: report.id,
          status: ReportStatus.Resolved,
        },
      },
    });

    return !!reviewResult.data?.adminReviewReport;
  };

  return {
    handleReportAction,
    handleBanUser,
    loading: reviewing || suspending,
    banErrorMessage,
    clearBanError: () => setBanErrorMessage(null),
  };
}
