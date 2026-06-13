import type { Pool } from 'pg';
import type { DailyEntry } from './types';

/**
 * Loads all daily entries ordered by entry_date descending.
 */
export const getAllDailyEntries = async (pool: Pool): Promise<DailyEntry[]> => {
  console.log('💾 getAllDailyEntries');
  try {
    const result = await pool.query<DailyEntry>(
      'SELECT * FROM daily_entries ORDER BY entry_date DESC, focus_area_id ASC',
    );
    return result.rows;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load daily entries: ${message}`);
  }
};
