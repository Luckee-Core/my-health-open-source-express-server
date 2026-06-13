import type { Pool } from 'pg';
import { createDailyEntry } from '../../data/daily-entries/create-daily-entry';
import type { CreateDailyEntryInput, DailyEntry } from '../../data/daily-entries/types';
import { assertFocusAreaExists, parseEntryDate } from '../../utils/daily-entries';
import { isUniqueViolation } from '../../utils/postgres';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates a daily entry after validating input and foreign keys.
 */
export const processCreateDailyEntry = async (
  pool: Pool,
  input: CreateDailyEntryInput,
): Promise<DailyEntry> => {
  if (!input.focus_area_id?.trim()) throw new Error('focus_area_id is required');
  if (!input.entry_date?.trim()) throw new Error('entry_date is required');

  const entryDate = parseEntryDate(input.entry_date);
  await assertFocusAreaExists(pool, input.focus_area_id);

  try {
    return await createDailyEntry(pool, {
      entry_date: entryDate,
      focus_area_id: input.focus_area_id,
      notes: optionalText(input.notes),
    });
  } catch (error) {
    if (isUniqueViolation(error, 'idx_daily_entries_date_focus_area')) {
      throw new Error('An entry already exists for this date and focus area');
    }
    throw error;
  }
};
