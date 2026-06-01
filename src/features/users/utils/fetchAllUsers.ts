import { AdminGetUsersDocument, type AdminGetUsersQuery } from "@/gql/graphql";
import { fetchAllPaginated } from "@/lib/fetchAllPaginated";
import type { UserFilters } from "@/types/user.types";
import type { User } from "@/types/user.types";
import { buildUsersQueryVariables } from "./buildUsersQueryVariables";

export async function fetchAllUsers(
  limit: number,
  filters: UserFilters
): Promise<User[]> {
  return fetchAllPaginated<AdminGetUsersQuery, ReturnType<typeof buildUsersQueryVariables>, User>(
    limit,
    {
      query: AdminGetUsersDocument,
      buildVariables: (page, pageLimit) =>
        buildUsersQueryVariables(page, pageLimit, filters),
      extractPage: (data) => {
        const result = data.adminGetUsers;
        if (!result) {
          return null;
        }
        return {
          items: result.items ?? [],
          hasNextPage: result.hasNextPage,
        };
      },
    }
  );
}
