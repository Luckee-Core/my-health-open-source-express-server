import type { Pool } from 'pg';
import { FEED_LOG_SELECT } from './select-columns';
import type { FeedLog } from '../../model/feed-log';

/**
 * Loads the one-time starting pump snapshot, if any.
 */
export const getStartFeedLog = async (pool: Pool): Promise<FeedLog | null> => {
  const result = await pool.query<FeedLog>(
    `SELECT ${FEED_LOG_SELECT}
     FROM feed_logs
     WHERE is_start = true
     LIMIT 1`,
  );
  return result.rows[0] ?? null;
};
