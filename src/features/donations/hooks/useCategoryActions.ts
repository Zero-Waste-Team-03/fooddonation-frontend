import { useState } from "react";
import {
  CategoriesDocument,
  DonationStatisticsDocument,
  DonationsDocument,
  type CreateCategoryInput,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/gql/graphql";
import type { UpdateCategoryFormValues } from "@/types/donation.types";
import {
  parseDonationActionError,
  type DonationActionErrorMessage,
} from "../utils/parseDonationActionError";

export function useCategoryActions() {
  const [errorMessage, setErrorMessage] = useState<DonationActionErrorMessage | null>(null);

  const [createCategory, { loading: creating }] = useCreateCategoryMutation({
    refetchQueries: [CategoriesDocument],
    onError: (err: unknown) => setErrorMessage(parseDonationActionError(err)),
  });

  const [deleteCategory, { loading: deleting }] = useDeleteCategoryMutation({
    refetchQueries: [CategoriesDocument, DonationsDocument, DonationStatisticsDocument],
    onError: (err: unknown) => setErrorMessage(parseDonationActionError(err)),
  });

  const [updateCategory, { loading: updating }] = useUpdateCategoryMutation({
    refetchQueries: [CategoriesDocument],
    onError: (err: unknown) => setErrorMessage(parseDonationActionError(err)),
  });

  const handleCreate = async (input: CreateCategoryInput): Promise<boolean> => {
    setErrorMessage(null);
    const result = await createCategory({ variables: { input } });
    return !!result.data?.createCategory;
  };

  const handleDelete = async (categoryId: string): Promise<boolean> => {
    setErrorMessage(null);
    const result = await deleteCategory({ variables: { id: categoryId } });
    return !!result.data?.deleteCategory;
  };

  const handleUpdate = async (values: UpdateCategoryFormValues): Promise<boolean> => {
    setErrorMessage(null);
    const result = await updateCategory({
      variables: {
        id: values.id,
        input: {
          name: values.name.trim(),
          reputationGain: values.reputationGain,
          sensitivity: values.sensitivity,
        },
      },
    });
    return !!result.data?.updateCategory;
  };

  const clearError = () => setErrorMessage(null);

  return {
    handleCreate,
    handleDelete,
    handleUpdate,
    loading: creating || deleting || updating,
    updating,
    errorMessage,
    clearError,
  };
}
