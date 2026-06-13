import type { Pool } from 'pg';
import { updateDailyEntryById } from '../../data/daily-entries/update-daily-entry-by-id';
import type { DailyEntry, UpdateDailyEntryInput } from '../../data/daily-entries/types';
import { assertFocusAreaExists, parseEntryDate } from '../../utils/daily-entries';
import { isUniqueViolation } from '../../utils/postgres';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates a daily entry by id after validating input and foreign keys.
 */
export const processUpdateDailyEntryById = async (
  pool: Pool,
  id: string,
  input: UpdateDailyEntryInput,
): Promise<DailyEntry> => {
  const normalized: UpdateDailyEntryInput = { ...input };

  if (input.entry_date !== undefined) {
    if (!input.entry_date.trim()) throw new Error('entry_date cannot be empty');
    normalized.entry_date = parseEntryDate(input.entry_date);
  }
  if (input.focus_area_id !== undefined) {
    if (!input.focus_area_id.trim()) throw new Error('focus_area_id cannot be empty');
    await assertFocusAreaExists(pool, input.focus_area_id);
    normalized.focus_area_id = input.focus_area_id;
  }
  if (input.notes !== undefined) normalized.notes = optionalText(input.notes);

  try {
    return await updateDailyEntryById(pool, id, normalized);
  } catch (error) {
    if (isUniqueViolation(error, 'idx_daily_entries_date_focus_area')) {
      throw new Error('An entry already exists for this date and focus area');
    }
    throw error;
  }
};
