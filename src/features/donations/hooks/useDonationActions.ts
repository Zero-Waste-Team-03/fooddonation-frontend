import { useState } from "react";
import { useAtomValue } from "jotai";
import type { ApolloCache } from "@apollo/client";
import {
  DonationStatisticsDocument,
  DonationsDocument,
  type ApproveDonationMutation,
  type DonationsQuery,
  useApproveDonationMutation,
  useCreateDonationMutation,
  useDeleteDonationMutation,
} from "@/gql/graphql";
import type { CreateDonationInput } from "@/gql/graphql";
import {
  donationFiltersAtom,
  donationsPageAtom,
  donationsPageSizeAtom,
} from "@/store";
import { buildDonationsQueryVariables } from "../utils/buildDonationsQueryVariables";
import {
  parseDonationActionError,
  type DonationActionErrorMessage,
} from "../utils/parseDonationActionError";

function updateDonationsCacheAfterApprove(
  cache: ApolloCache,
  approved: ApproveDonationMutation["approveDonation"],
  listVariables: ReturnType<typeof buildDonationsQueryVariables>
) {
  cache.updateQuery<DonationsQuery>(
    { query: DonationsDocument, variables: listVariables },
    (existing: DonationsQuery | null) => {
      if (!existing?.donations?.items) {
        return existing;
      }

      return {
        ...existing,
        donations: {
          ...existing.donations,
          items: existing.donations.items.map((item) =>
            item.id === approved.id ? { ...item, ...approved } : item
          ),
        },
      };
    }
  );

  cache.updateQuery(
    { query: DonationStatisticsDocument },
    (existing: { donationStatistics?: { pendingApprovals: number } } | null) => {
      if (!existing?.donationStatistics) {
        return existing;
      }

      const pendingApprovals = Math.max(
        existing.donationStatistics.pendingApprovals - 1,
        0
      );

      return {
        ...existing,
        donationStatistics: {
          ...existing.donationStatistics,
          pendingApprovals,
        },
      };
    }
  );
}

export function useDonationActions() {
  const [errorMessage, setErrorMessage] = useState<DonationActionErrorMessage | null>(null);
  const page = useAtomValue(donationsPageAtom);
  const limit = useAtomValue(donationsPageSizeAtom);
  const filters = useAtomValue(donationFiltersAtom);
  const listVariables = buildDonationsQueryVariables(page, limit, filters);

  const [deleteDonation, { loading: deleting }] = useDeleteDonationMutation({
    refetchQueries: [DonationsDocument, DonationStatisticsDocument],
    onError: (err: unknown) => setErrorMessage(parseDonationActionError(err)),
  });

  const [createDonation, { loading: creating }] = useCreateDonationMutation({
    refetchQueries: [DonationsDocument, DonationStatisticsDocument],
    onError: (err: unknown) => setErrorMessage(parseDonationActionError(err)),
  });

  const [approveDonation, { loading: approving }] = useApproveDonationMutation({
    onError: (err: unknown) => setErrorMessage(parseDonationActionError(err)),
    update: (cache, { data }) => {
      if (!data?.approveDonation) {
        return;
      }

      updateDonationsCacheAfterApprove(cache, data.approveDonation, listVariables);
    },
  });

  const handleDelete = async (donationId: string): Promise<boolean> => {
    setErrorMessage(null);
    const result = await deleteDonation({ variables: { id: donationId } });
    return !!result.data?.deleteDonation;
  };

  const handleCreate = async (input: CreateDonationInput): Promise<boolean> => {
    setErrorMessage(null);
    const result = await createDonation({ variables: { input } });
    return !!result.data?.createDonation;
  };

  const handleApprove = async (donationId: string): Promise<boolean> => {
    setErrorMessage(null);
    const result = await approveDonation({ variables: { donationId } });
    return !!result.data?.approveDonation;
  };

  const clearError = () => setErrorMessage(null);

  return {
    handleDelete,
    handleCreate,
    handleApprove,
    loading: deleting || creating || approving,
    errorMessage,
    clearError,
  };
}
