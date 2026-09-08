import type { Pool } from 'pg';
import { deleteFeedFormulaById } from '../../data/feed-formulas';

/**
 * Deletes a feed formula by id.
 */
export const processDeleteFeedFormulaById = async (
  pool: Pool,
  id: string,
): Promise<void> => {
  const deleted = await deleteFeedFormulaById(pool, id);
  if (!deleted) {
    throw new Error('Feed formula not found');
  }
};
