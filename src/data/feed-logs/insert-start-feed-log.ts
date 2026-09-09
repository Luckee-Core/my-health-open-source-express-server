import type { Pool, PoolClient } from 'pg';
import { FEED_LOG_SELECT } from './select-columns';
import type { FeedLog } from '../../model/feed-log';

type Db = Pool | PoolClient;

/**
 * Inserts the one-time starting pump snapshot.
 */
export const insertStartFeedLog = async (
  db: Db,
  input: {
    log_date: string;
    formula_id: string;
    intermittent_rate_ml_per_hr: number;
    feed_left_ml: number;
    total_fed_ml: number;
    calories_per_1000_ml: number;
    notes: string | null;
  },
): Promise<FeedLog> => {
  console.log('💾 insertStartFeedLog');
  const result = await db.query<FeedLog>(
    `INSERT INTO feed_logs (
      log_date, formula_id, intermittent_rate_ml_per_hr, feed_left_ml,
      total_fed_ml, pump_reset, is_start, calories_per_1000_ml, notes
    )
    VALUES ($1, $2, $3, $4, $5, false, true, $6, $7)
    RETURNING ${FEED_LOG_SELECT}`,
    [
      input.log_date,
      input.formula_id,
      input.intermittent_rate_ml_per_hr,
      input.feed_left_ml,
      input.total_fed_ml,
      input.calories_per_1000_ml,
      input.notes,
    ],
  );
  return result.rows[0];
};
