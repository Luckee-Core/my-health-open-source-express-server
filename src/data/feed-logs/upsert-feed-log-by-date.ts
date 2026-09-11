import type { Pool, PoolClient } from 'pg';
import { FEED_LOG_SELECT } from './select-columns';
import type { FeedLog } from '../../model/feed-log';

type Db = Pool | PoolClient;

/**
 * Inserts or updates the pump snapshot for a calendar date.
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
    calories_per_1000_ml: number;
    notes: string | null;
  },
): Promise<FeedLog> => {
  console.log('💾 upsertFeedLogByDate');
  const params = [
    input.log_date,
    input.formula_id,
    input.intermittent_rate_ml_per_hr,
    input.feed_left_ml,
    input.total_fed_ml,
    input.pump_reset,
    input.calories_per_1000_ml,
    input.notes,
  ];

  const updated = await db.query<FeedLog>(
    `UPDATE feed_logs SET
      formula_id = $2,
      intermittent_rate_ml_per_hr = $3,
      feed_left_ml = $4,
      total_fed_ml = $5,
      pump_reset = $6,
      is_start = false,
      calories_per_1000_ml = $7,
      notes = $8,
      updated_at = now()
     WHERE log_date = $1
     RETURNING ${FEED_LOG_SELECT}`,
    params,
  );

  if (updated.rows.length > 1) {
    const keepId = updated.rows[0].id;
    await db.query(`DELETE FROM feed_logs WHERE log_date = $1 AND id <> $2`, [
      input.log_date,
      keepId,
    ]);
  }

  if (updated.rows[0]) {
    return updated.rows[0];
  }

  const inserted = await db.query<FeedLog>(
    `INSERT INTO feed_logs (
      log_date, formula_id, intermittent_rate_ml_per_hr, feed_left_ml,
      total_fed_ml, pump_reset, is_start, calories_per_1000_ml, notes
    )
    VALUES ($1, $2, $3, $4, $5, $6, false, $7, $8)
    RETURNING ${FEED_LOG_SELECT}`,
    params,
  );
  return inserted.rows[0];
};
