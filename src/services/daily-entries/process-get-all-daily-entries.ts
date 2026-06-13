import type { Pool } from 'pg';
import { getAllDailyEntries } from '../../data/daily-entries/get-all-daily-entries';
import type { DailyEntry } from '../../data/daily-entries/types';

/**
 * Loads all daily entries.
 */
export const processGetAllDailyEntries = async (pool: Pool): Promise<DailyEntry[]> => {
  return getAllDailyEntries(pool);
};
