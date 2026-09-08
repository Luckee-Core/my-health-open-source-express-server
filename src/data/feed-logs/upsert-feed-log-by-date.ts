import type { Pool, PoolClient } from 'pg';
import { FEED_LOG_SELECT } from './select-columns';
import type { FeedLog } from '../../model/feed-log';

type Db = Pool | PoolClient;

/**
 * Inserts or updates a feed log for a calendar date.
 */
export const upsertFeedLogByDate = async (
  db: Db,
  input: {
    log_date: string;
    formula_id: string;
    intermittent_rate_ml_per_hr: number;
    feed_left_ml: number;
    total_fed_ml: number;
    pump_reset: boolean;
    is_start: boolean;
    calories_per_1000_ml: number;
    notes: string | null;
  },
): Promise<FeedLog> => {
  console.log('💾 upsertFeedLogByDate');
  const result = await db.query<FeedLog>(
    `INSERT INTO feed_logs (
      log_date, formula_id, intermittent_rate_ml_per_hr, feed_left_ml,
      total_fed_ml, pump_reset, is_start, calories_per_1000_ml, notes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (log_date)
    DO UPDATE SET
      formula_id = EXCLUDED.formula_id,
      intermittent_rate_ml_per_hr = EXCLUDED.intermittent_rate_ml_per_hr,
      feed_left_ml = EXCLUDED.feed_left_ml,
      total_fed_ml = EXCLUDED.total_fed_ml,
      pump_reset = EXCLUDED.pump_reset,
      is_start = feed_logs.is_start OR EXCLUDED.is_start,
      calories_per_1000_ml = EXCLUDED.calories_per_1000_ml,
      notes = EXCLUDED.notes,
      updated_at = now()
    RETURNING ${FEED_LOG_SELECT}`,
    [
      input.log_date,
      input.formula_id,
      input.intermittent_rate_ml_per_hr,
      input.feed_left_ml,
      input.total_fed_ml,
      input.pump_reset,
      input.is_start,
      input.calories_per_1000_ml,
      input.notes,
    ],
  );
  return result.rows[0];
};
