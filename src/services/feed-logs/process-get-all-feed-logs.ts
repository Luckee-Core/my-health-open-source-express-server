import type { Pool } from 'pg';
import { getAllFeedLogs } from '../../data/feed-logs';
import type { FeedLog } from '../../model/feed-log';
/**
 * Loads all feed logs.
 */
export const processGetAllFeedLogs = async (pool: Pool): Promise<FeedLog[]> => {
  return getAllFeedLogs(pool);
};
