import type { Pool } from 'pg';
import { isUniqueViolation } from '../../utils/postgres';
import { assertFocusAreaExists } from './assert-focus-area-exists';
import type { DailyEntry, UpdateDailyEntryInput } from './types';

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
 * Updates a daily entry by id.
 */
export const updateDailyEntryById = async (
  pool: Pool,
  id: string,
  input: UpdateDailyEntryInput,
): Promise<DailyEntry> => {
  const sets: string[] = ['updated_at = now()'];
  const values: (string | null)[] = [];
  let param = 1;

  if (input.entry_date !== undefined) {
    if (!input.entry_date.trim()) {
      throw new Error('entry_date cannot be empty');
    }
    sets.push(`entry_date = $${param++}`);
    values.push(parseEntryDate(input.entry_date));
  }

  if (input.focus_area_id !== undefined) {
    if (!input.focus_area_id.trim()) {
      throw new Error('focus_area_id cannot be empty');
    }
    await assertFocusAreaExists(pool, input.focus_area_id);
    sets.push(`focus_area_id = $${param++}`);
    values.push(input.focus_area_id);
  }

  if (input.notes !== undefined) {
    sets.push(`notes = $${param++}`);
    values.push(optionalText(input.notes));
  }

  values.push(id);

  try {
    const result = await pool.query<DailyEntry>(
      `UPDATE daily_entries SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('daily entry not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'daily entry not found') {
      throw error;
    }
    if (isUniqueViolation(error, 'idx_daily_entries_date_focus_area')) {
      throw new Error('An entry already exists for this date and focus area');
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update daily entry: ${message}`);
  }
};
