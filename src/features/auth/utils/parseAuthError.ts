import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";

export type AuthErrorMessage =
  | "Invalid email or password."
  | "No account found with this email address."
  | "Your account has been deactivated. Contact support."
  | "Too many login attempts. Please try again later."
  | "A network error occurred. Check your connection and try again."
  | "An unexpected error occurred. Please try again.";

type ExtensionRecord = Record<string, unknown>;

type GraphQLErrorShape = {
  message: string;
  extensions?: unknown;
};

function isExtensionRecord(value: unknown): value is ExtensionRecord {
  return typeof value === "object" && value !== null;
}

function getNestedRecord(record: ExtensionRecord, key: string): ExtensionRecord | null {
  const value = record[key];
  return isExtensionRecord(value) ? value : null;
}

function getStatusCode(extensions: unknown): number | null {
  if (!isExtensionRecord(extensions)) {
    return null;
  }

  const directStatus = extensions.statusCode;
  if (typeof directStatus === "number") {
    return directStatus;
  }

  const response = getNestedRecord(extensions, "response");
  if (response && typeof response.statusCode === "number") {
    return response.statusCode;
  }

  const exception = getNestedRecord(extensions, "exception");
  if (exception && typeof exception.status === "number") {
    return exception.status;
  }

  return null;
}

function getErrorCode(extensions: unknown): string {
  if (!isExtensionRecord(extensions)) {
    return "";
  }

  const code = extensions.code;
  return typeof code === "string" ? code.toUpperCase() : "";
}

function getGraphQLErrors(error: unknown): GraphQLErrorShape[] {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.map((item) => ({
      message: item.message,
      extensions: item.extensions,
    }));
  }

  if (!isExtensionRecord(error)) {
    return [];
  }

  const graphQLErrorsValue = error.graphQLErrors;
  if (!Array.isArray(graphQLErrorsValue)) {
    return [];
  }

  return graphQLErrorsValue
    .filter(isExtensionRecord)
    .map((item) => ({
      message: typeof item.message === "string" ? item.message : "",
      extensions: item.extensions,
    }))
    .filter((item) => item.message.length > 0);
}

function hasNetworkError(error: unknown): boolean {
  if (ServerError.is(error)) {
    return true;
  }

  if (!isExtensionRecord(error)) {
    return false;
  }

  return error.networkError !== undefined;
}

export function parseAuthError(error: unknown): AuthErrorMessage {
  if (hasNetworkError(error)) {
    return "A network error occurred. Check your connection and try again.";
  }

  const graphQLErrors = getGraphQLErrors(error);

  if (!graphQLErrors.length) {
    return "An unexpected error occurred. Please try again.";
  }

  const gqlError = graphQLErrors[0];
  const code = getErrorCode(gqlError.extensions);
  const statusCode = getStatusCode(gqlError.extensions);
  const message = gqlError.message.toLowerCase();

  const isInvalidCredentials =
    code === "UNAUTHENTICATED" ||
    code === "UNAUTHORIZED" ||
    statusCode === 401 ||
    message.includes("unauthorized") ||
    message.includes("unauthorized exception") ||
    message.includes("invalid credential") ||
    message.includes("invalid credentials") ||
    message.includes("wrong password") ||
    message.includes("incorrect password");

  if (isInvalidCredentials) {
    return "Invalid email or password.";
  }

  const isUserNotFound =
    code === "NOT_FOUND" ||
    statusCode === 404 ||
    message.includes("not found") ||
    message.includes("not found exception") ||
    message.includes("user not found") ||
    message.includes("no user");

  if (isUserNotFound) {
    return "No account found with this email address.";
  }

  const isDeactivatedAccount =
    code === "FORBIDDEN" ||
    statusCode === 403 ||
    message.includes("deactivated") ||
    message.includes("banned") ||
    message.includes("suspended");

  if (isDeactivatedAccount) {
    return "Your account has been deactivated. Contact support.";
  }

  const isRateLimited =
    code === "TOO_MANY_REQUESTS" ||
    statusCode === 429 ||
    message.includes("rate limit") ||
    message.includes("too many");

  if (isRateLimited) {
    return "Too many login attempts. Please try again later.";
  }

  return "An unexpected error occurred. Please try again.";
}
