/**
 * Parses and validates an entry_date string (YYYY-MM-DD).
 */
export const parseEntryDate = (value: string): string => {
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new Error('Invalid entry_date');
  }
  const parsed = new Date(`${trimmed}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid entry_date');
  }
  return trimmed;
};
