import type { Pool } from 'pg';

/**
 * Deletes a daily entry by id.
 */
export const deleteDailyEntryById = async (pool: Pool, id: string): Promise<void> => {
  try {
    await pool.query('DELETE FROM daily_entries WHERE id = $1', [id]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete daily entry: ${message}`);
  }
};
