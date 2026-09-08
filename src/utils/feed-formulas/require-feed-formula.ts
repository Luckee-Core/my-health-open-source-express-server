import type { Pool } from 'pg';
import { getFeedFormulaById } from '../../data/feed-formulas';
import type { FeedFormula } from '../../model/feed-formula';
/**
 * Loads a feed formula or throws when missing.
 */
export const requireFeedFormula = async (
  pool: Pool,
  formulaId: string,
): Promise<FeedFormula> => {
  const row = await getFeedFormulaById(pool, formulaId);
  if (!row) {
    throw new Error('Feed formula not found');
  }
  return row;
};
