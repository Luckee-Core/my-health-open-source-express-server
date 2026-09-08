import type { Pool } from 'pg';
import { getAllDailyEntries } from '../../data/daily-entries/get-all-daily-entries';
import type { DailyEntry } from '../../model/daily-entry';

/**
 * Loads all daily entries.
 */
export const processGetAllDailyEntries = async (pool: Pool): Promise<DailyEntry[]> => {
  return getAllDailyEntries(pool);
};
