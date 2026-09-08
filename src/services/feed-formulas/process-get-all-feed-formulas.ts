import type { Pool } from 'pg';
import { getAllFeedFormulas } from '../../data/feed-formulas';
import type { FeedFormula } from '../../model/feed-formula';
/**
 * Loads all feed formulas.
 */
export const processGetAllFeedFormulas = async (pool: Pool): Promise<FeedFormula[]> => {
  return getAllFeedFormulas(pool);
};
