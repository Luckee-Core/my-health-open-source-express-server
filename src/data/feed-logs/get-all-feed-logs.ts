import type { Pool } from 'pg';
import { FEED_LOG_SELECT } from './select-columns';
import type { FeedLog } from '../../model/feed-log';

/**
 * Loads all feed logs newest first.
 */
export const getAllFeedLogs = async (pool: Pool): Promise<FeedLog[]> => {
  const result = await pool.query<FeedLog>(
    `SELECT ${FEED_LOG_SELECT}
     FROM feed_logs
     ORDER BY log_date DESC, created_at DESC`,
  );
  return result.rows;
};
