import type { UserRole } from "@/gql/graphql";

export type AuthUserAvatar = {
  id: string;
  url?: string | null;
} | null;

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string | null;
  avatar?: AuthUserAvatar;
};

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};
