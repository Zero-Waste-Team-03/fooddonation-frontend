import { matchesVerificationStatusFilter } from "@/constants/users.constants";
import type { User, UserFilters } from "@/types/user.types";

export function filterUsersByVerification(
  users: User[],
  verificationStatus: UserFilters["verificationStatus"]
): User[] {
  if (verificationStatus === null) {
    return users;
  }
  return users.filter((user) => matchesVerificationStatusFilter(user, verificationStatus));
}
