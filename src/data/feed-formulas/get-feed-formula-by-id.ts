import type { Pool } from 'pg';
import { FEED_FORMULA_SELECT } from './select-columns';
import type { FeedFormula } from '../../model/feed-formula';

/**
 * Loads a feed formula by id.
 */
export const getFeedFormulaById = async (
  pool: Pool,
  id: string,
): Promise<FeedFormula | null> => {
  const result = await pool.query<FeedFormula>(
    `SELECT ${FEED_FORMULA_SELECT} FROM feed_formulas WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
};
