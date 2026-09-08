import { parseFiniteNumber } from './parse-finite-number';

/**
 * Parses an optional finite number; empty values become null.
 */
export const parseOptionalFiniteNumber = (
  value: unknown,
  field: string,
): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return parseFiniteNumber(value, field);
};
