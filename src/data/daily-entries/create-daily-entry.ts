import type { Pool } from 'pg';
import { isUniqueViolation } from '../../utils/postgres';
import { assertFocusAreaExists } from './assert-focus-area-exists';
import type { CreateDailyEntryInput, DailyEntry } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const parseEntryDate = (value: string): string => {
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

/**
 * Creates a daily entry record.
 */
export const createDailyEntry = async (
  pool: Pool,
  input: CreateDailyEntryInput,
): Promise<DailyEntry> => {
  if (!input.focus_area_id?.trim()) {
    throw new Error('focus_area_id is required');
  }
  if (!input.entry_date?.trim()) {
    throw new Error('entry_date is required');
  }

  const entryDate = parseEntryDate(input.entry_date);
  await assertFocusAreaExists(pool, input.focus_area_id);

  try {
    const result = await pool.query<DailyEntry>(
      `INSERT INTO daily_entries (entry_date, focus_area_id, notes)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [entryDate, input.focus_area_id, optionalText(input.notes)],
    );
    return result.rows[0];
  } catch (error) {
    if (isUniqueViolation(error, 'idx_daily_entries_date_focus_area')) {
      throw new Error('An entry already exists for this date and focus area');
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create daily entry: ${message}`);
  }
};
