import type { Pool } from 'pg';
import type { CreateDailyEntryInput, DailyEntry } from './types';

/**
 * Creates a daily entry record.
 */
export const createDailyEntry = async (
  pool: Pool,
  input: CreateDailyEntryInput,
): Promise<DailyEntry> => {
  console.log('💾 createDailyEntry');
  try {
    const result = await pool.query<DailyEntry>(
      `INSERT INTO daily_entries (entry_date, focus_area_id, notes)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [input.entry_date, input.focus_area_id, input.notes ?? null],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create daily entry: ${message}`);
  }
};
