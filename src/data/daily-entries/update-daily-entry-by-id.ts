import type { Pool } from 'pg';
import type { DailyEntry, UpdateDailyEntryInput } from './types';

/**
 * Updates a daily entry by id.
 */
export const updateDailyEntryById = async (
  pool: Pool,
  id: string,
  input: UpdateDailyEntryInput,
): Promise<DailyEntry> => {
  console.log('💾 updateDailyEntryById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | null)[] = [];
  let param = 1;

  if (input.entry_date !== undefined) {
    sets.push(`entry_date = $${param++}`);
    values.push(input.entry_date);
  }
  if (input.focus_area_id !== undefined) {
    sets.push(`focus_area_id = $${param++}`);
    values.push(input.focus_area_id);
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${param++}`);
    values.push(input.notes);
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
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update daily entry: ${message}`);
  }
};
