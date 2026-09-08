import type { Pool, PoolClient } from 'pg';
import { FEED_FORMULA_SELECT } from './select-columns';
import type { CreateFeedFormulaInput, FeedFormula } from '../../model/feed-formula';

type Db = Pool | PoolClient;

/**
 * Creates a feed formula catalog row.
 */
export const createFeedFormula = async (
  db: Db,
  input: CreateFeedFormulaInput,
): Promise<FeedFormula> => {
  console.log('💾 createFeedFormula');
  const result = await db.query<FeedFormula>(
    `INSERT INTO feed_formulas (
      brand, name, calories_per_1000_ml, container_volume_ml,
      volume_fl_oz, volume_qt, volume_l, is_active, notes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING ${FEED_FORMULA_SELECT}`,
    [
      input.brand,
      input.name,
      input.calories_per_1000_ml,
      input.container_volume_ml ?? 1000,
      input.volume_fl_oz ?? null,
      input.volume_qt ?? null,
      input.volume_l ?? null,
      input.is_active ?? true,
      input.notes ?? null,
    ],
  );
  return result.rows[0];
};
