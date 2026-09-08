import type { Pool } from 'pg';
import { deleteFeedLogById } from '../../data/feed-logs';

/**
 * Deletes a feed log by id.
 */
export const processDeleteFeedLogById = async (pool: Pool, id: string): Promise<void> => {
  const deleted = await deleteFeedLogById(pool, id);
  if (!deleted) {
    throw new Error('Feed log not found');
  }
};
