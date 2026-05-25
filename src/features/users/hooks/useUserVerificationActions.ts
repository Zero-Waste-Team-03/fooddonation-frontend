import { useAtomValue } from "jotai";
import type { ApolloCache } from "@apollo/client";
import { toast } from "sonner";
import {
  AdminGetUsersDocument,
  type AdminGetUsersQuery,
  type AdminUpdateUserFoodSaverStatusMutation,
  type AdminUpdateUserVerificationStatusMutation,
  useAdminUpdateUserFoodSaverStatusMutation,
  useAdminUpdateUserVerificationStatusMutation,
} from "@/gql/graphql";
import {
  userFiltersAtom,
  usersPageAtom,
  usersPageSizeAtom,
} from "@/store";
import { buildUsersQueryVariables } from "../utils/buildUsersQueryVariables";
import { parseUserActionError } from "../utils/parseUserActionError";

type UpdatedUser =
  | AdminUpdateUserFoodSaverStatusMutation["adminUpdateUserFoodSaverStatus"]
  | AdminUpdateUserVerificationStatusMutation["adminUpdateUserVerificationStatus"];

function updateUsersCacheAfterMutation(
  cache: ApolloCache,
  updatedUser: UpdatedUser,
  listVariables: ReturnType<typeof buildUsersQueryVariables>
) {
  cache.updateQuery<AdminGetUsersQuery>(
    { query: AdminGetUsersDocument, variables: listVariables },
    (existing: AdminGetUsersQuery | null) => {
      if (!existing?.adminGetUsers?.items) {
        return existing;
      }

      return {
        ...existing,
        adminGetUsers: {
          ...existing.adminGetUsers,
          items: existing.adminGetUsers.items.map((item) =>
            item.id === updatedUser.id ? { ...item, ...updatedUser } : item
          ),
        },
      };
    }
  );
}

export function useUserVerificationActions() {
  const page = useAtomValue(usersPageAtom);
  const limit = useAtomValue(usersPageSizeAtom);
  const filters = useAtomValue(userFiltersAtom);
  const listVariables = buildUsersQueryVariables(page, limit, filters);

  const [updateFoodSaverStatus, { loading: updatingFoodSaver }] =
    useAdminUpdateUserFoodSaverStatusMutation({
      update: (cache, { data }) => {
        if (!data?.adminUpdateUserFoodSaverStatus) {
          return;
        }

        updateUsersCacheAfterMutation(
          cache,
          data.adminUpdateUserFoodSaverStatus,
          listVariables
        );
      },
      onError: (error) => {
        toast.error(parseUserActionError(error));
      },
    });

  const [updateVerificationStatus, { loading: updatingVerification }] =
    useAdminUpdateUserVerificationStatusMutation({
      update: (cache, { data }) => {
        if (!data?.adminUpdateUserVerificationStatus) {
          return;
        }

        updateUsersCacheAfterMutation(
          cache,
          data.adminUpdateUserVerificationStatus,
          listVariables
        );
      },
      onError: (error) => {
        toast.error(parseUserActionError(error));
      },
    });

  const handleToggleFoodSaver = async (userId: string, currentIsFoodSaver: boolean) => {
    await updateFoodSaverStatus({
      variables: {
        userId,
        isFoodSaver: !currentIsFoodSaver,
      },
    });
  };

  const handleToggleVerification = async (userId: string, currentIsVerified: boolean) => {
    await updateVerificationStatus({
      variables: {
        userId,
        isVerified: !currentIsVerified,
      },
    });
  };

  return {
    handleToggleFoodSaver,
    handleToggleVerification,
    loading: updatingFoodSaver || updatingVerification,
  };
}
