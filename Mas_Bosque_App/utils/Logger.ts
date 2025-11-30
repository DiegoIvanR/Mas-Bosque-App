/**
 * Utility: src/utils/Logger.ts
 *
 * A simple, centralized logger that sends data to both
 * the local console and Sentry.
 */

import * as Sentry from "@sentry/react-native";

const getTimestamp = (): string => new Date().toISOString();

/**
 * Logs an informational message.
 * Also adds a Sentry breadcrumb for context.
 * @param message The main log message.
 * @param context Optional object for additional data.
 */
export const log = (message: string, context?: object) => {
  const contextString = context ? `| Context: ${JSON.stringify(context)}` : "";
  console.log(`[INFO] ${getTimestamp()}: ${message} ${contextString}`);

  // --- Sentry Integration ---
  Sentry.addBreadcrumb({
    category: "info",
    message: message,
    level: "info",
    data: context,
  });
  // -------------------------
};

/**
 * Logs a warning message.
 * Also adds a Sentry breadcrumb for context.
 * @param message The warning message.
 * @param context Optional object for additional data.
 */
export const warn = (message: string, context?: object) => {
  const contextString = context ? `| Context: ${JSON.stringify(context)}` : "";
  console.warn(`[WARN] ${getTimestamp()}: ${message} ${contextString}`);

  // --- Sentry Integration ---
  Sentry.addBreadcrumb({
    category: "warn",
    message: message,
    level: "warning",
    data: context,
  });
  // -------------------------
};

/**
 * Logs an error.
 * Also captures a full exception or message in Sentry.
 * @param message The error message.
 * @param error The error object (optional).
 * @param context Optional object for additional data.
 */
export const error = (
  message: string,
  error?: any,
  context?: Record<string, any>
) => {
  const errorString = error ? `| Error: ${error.message || error}` : "";
  const contextString = context ? `| Context: ${JSON.stringify(context)}` : "";
  console.error(
    `[ERROR] ${getTimestamp()}: ${message} ${errorString} ${contextString}`
  );

  // --- Sentry Integration ---
  Sentry.withScope((scope) => {
    // Add your custom context to the Sentry scope
    if (context) {
      scope.setContext("Custom Context", context as Record<string, any>);
    }
    // Add the log message as an "extra"
    scope.setExtra("Log Message", message);

    // If we have an actual Error object, capture it.
    // This provides the most data (like stack traces).
    if (error) {
      Sentry.captureException(error);
    } else {
      // If no error object was passed, just capture the message.
      Sentry.captureMessage(message, "error");
    }
  });
  // -------------------------
};

const Logger = {
  log,
  warn,
  error,
};

export default Logger;
