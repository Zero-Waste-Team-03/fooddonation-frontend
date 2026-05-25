import type { UserFilters } from "@/types/user.types";

export function buildUsersQueryVariables(
  page: number,
  limit: number,
  filters: UserFilters
) {
  return {
    page,
    limit,
    search: filters.search || undefined,
    role: filters.role ?? undefined,
    status: filters.status ?? undefined,
  };
}
