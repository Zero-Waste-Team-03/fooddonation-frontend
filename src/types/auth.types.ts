export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};
