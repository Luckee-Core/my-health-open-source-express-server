import type { Pool } from 'pg';
import { FEED_FORMULA_SELECT } from './select-columns';
import type { FeedFormula } from '../../model/feed-formula';

/**
 * Loads all feed formulas ordered by brand then name.
 */
export const getAllFeedFormulas = async (pool: Pool): Promise<FeedFormula[]> => {
  const result = await pool.query<FeedFormula>(
    `SELECT ${FEED_FORMULA_SELECT}
     FROM feed_formulas
     ORDER BY lower(brand) ASC, lower(name) ASC`,
  );
  return result.rows;
};
