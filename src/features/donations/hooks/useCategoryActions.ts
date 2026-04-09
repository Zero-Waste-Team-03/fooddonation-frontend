import { useState } from "react";
import {
  CategoriesDocument,
  DonationStatisticsDocument,
  DonationsDocument,
  type CreateCategoryInput,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/gql/graphql";
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

  const clearError = () => setErrorMessage(null);

  return {
    handleCreate,
    handleDelete,
    loading: creating || deleting,
    errorMessage,
    clearError,
  };
}
