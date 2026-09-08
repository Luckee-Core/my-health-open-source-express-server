import type { Pool } from 'pg';

/**
 * Deletes a feed formula by id.
 */
export const deleteFeedFormulaById = async (pool: Pool, id: string): Promise<boolean> => {
  const result = await pool.query('DELETE FROM feed_formulas WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};
