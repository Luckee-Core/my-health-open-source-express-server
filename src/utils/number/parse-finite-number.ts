/**
 * Parses a finite number from JSON body input.
 */
export const parseFiniteNumber = (value: unknown, field: string): number => {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) {
    throw new Error(`${field} must be a number`);
  }
  return n;
};
