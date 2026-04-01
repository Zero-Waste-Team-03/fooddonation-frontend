import type { User } from "@/gql/graphql";

export type AuthUser = Pick<User, "id" | "email" | "role" | "displayName" | "avatar">;

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};
