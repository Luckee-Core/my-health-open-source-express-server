/**
 * Validates severity is between 1 and 10 when provided.
 */
export const parseSeverity = (value: number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  if (!Number.isInteger(value) || value < 1 || value > 10) {
    throw new Error('severity must be an integer between 1 and 10');
  }
  return value;
};

/**
 * Validates duration is a non-negative integer when provided.
 */
export const parseDurationMinutes = (value: number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('duration_minutes must be a non-negative integer');
  }
  return value;
};
