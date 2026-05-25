import { Badge } from "@/components/ui/badge";
import {
  deriveUserVerificationStatus,
  userVerificationStatusBadgeVariant,
  userVerificationStatusLabels,
} from "@/constants/users.constants";

type UserStatusBadgeProps = {
  isFoodSaver: boolean;
  isVerified: boolean;
};

export function UserStatusBadge({ isFoodSaver, isVerified }: UserStatusBadgeProps) {
  const status = deriveUserVerificationStatus({ isFoodSaver, isVerified });

  return (
    <Badge variant={userVerificationStatusBadgeVariant(status)}>
      {userVerificationStatusLabels[status]}
    </Badge>
  );
}
