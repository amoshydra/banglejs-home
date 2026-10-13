/**
 * Normalise anything thrown into a readable message.
 *
 * Espruino's Comms rejects with strings (and sometimes null), so the common
 * `(error as Error).message` pattern ends up showing "undefined". This keeps
 * the actual reason visible.
 */
export const errorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error === null || error === undefined) return "Unknown error";

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};
