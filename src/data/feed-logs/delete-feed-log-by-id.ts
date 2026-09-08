import type { Pool } from 'pg';

/**
 * Deletes a feed log by id.
 */
export const deleteFeedLogById = async (pool: Pool, id: string): Promise<boolean> => {
  const result = await pool.query('DELETE FROM feed_logs WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};
