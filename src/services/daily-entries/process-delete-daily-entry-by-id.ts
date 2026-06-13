import type { Pool } from 'pg';
import { deleteDailyEntryById } from '../../data/daily-entries/delete-daily-entry-by-id';

/**
 * Deletes a daily entry by id.
 */
export const processDeleteDailyEntryById = async (pool: Pool, id: string): Promise<void> => {
  await deleteDailyEntryById(pool, id);
};
