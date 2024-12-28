/**
 * Determines if code is running in a browser environment
 * @returns {boolean} True if in browser environment
 */
export const isBrowser = (): boolean => {
  return (
    typeof window !== "undefined" && typeof window.document !== "undefined"
  );
};
