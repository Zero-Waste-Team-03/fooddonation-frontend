import { useState } from "react";
import {
  DonationStatisticsDocument,
  DonationsDocument,
  useCreateDonationMutation,
  useDeleteDonationMutation,
} from "@/gql/graphql";
import type { CreateDonationInput } from "@/gql/graphql";
import {
  parseDonationActionError,
  type DonationActionErrorMessage,
} from "../utils/parseDonationActionError";

export function useDonationActions() {
  const [errorMessage, setErrorMessage] = useState<DonationActionErrorMessage | null>(null);

  const [deleteDonation, { loading: deleting }] = useDeleteDonationMutation({
    refetchQueries: [DonationsDocument, DonationStatisticsDocument],
    onError: (err: unknown) => setErrorMessage(parseDonationActionError(err)),
  });

  const [createDonation, { loading: creating }] = useCreateDonationMutation({
    refetchQueries: [DonationsDocument, DonationStatisticsDocument],
    onError: (err: unknown) => setErrorMessage(parseDonationActionError(err)),
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

  const clearError = () => setErrorMessage(null);

  return {
    handleDelete,
    handleCreate,
    loading: deleting || creating,
    errorMessage,
    clearError,
  };
}
