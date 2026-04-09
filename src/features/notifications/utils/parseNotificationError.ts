import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";

export type NotificationActionErrorMessage =
  | "This notification could not be found."
  | "You do not have permission to perform this action."
  | "This action could not be completed. Please try again."
  | "A network error occurred. Check your connection and try again.";

type ExtensionRecord = Record<string, unknown>;

type GraphQLErrorShape = {
  message: string;
  extensions?: unknown;
};

function isExtensionRecord(value: unknown): value is ExtensionRecord {
  return typeof value === "object" && value !== null;
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

export function parseNotificationError(error: unknown): NotificationActionErrorMessage {
  if (hasNetworkError(error)) {
    return "A network error occurred. Check your connection and try again.";
  }

  const graphQLErrors = getGraphQLErrors(error);
  if (!graphQLErrors.length) {
    return "This action could not be completed. Please try again.";
  }

  const gqlError = graphQLErrors[0];
  const code = getErrorCode(gqlError.extensions);
  const message = gqlError.message.toLowerCase();

  if (code === "NOT_FOUND" || message.includes("not found")) {
    return "This notification could not be found.";
  }
  if (
    code === "FORBIDDEN" ||
    code === "UNAUTHORIZED" ||
    message.includes("permission") ||
    message.includes("forbidden")
  ) {
    return "You do not have permission to perform this action.";
  }
  return "This action could not be completed. Please try again.";
}
