/**
 * Normalizes a free-text label for use in source_entry_key segments.
 */
export const normalizeKeyPart = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);

/**
 * Builds a stable provenance key: `{prefix}:{normalizedParts...}`.
 */
export const computeSourceEntryKey = (prefix: string, ...parts: Array<string | null | undefined>): string => {
  const normalized = parts
    .map((part) => (part == null ? '' : normalizeKeyPart(String(part))))
    .filter((part) => part.length > 0);
  const body = normalized.length > 0 ? normalized.join(':') : 'unknown';
  return `${normalizeKeyPart(prefix)}:${body}`;
};
