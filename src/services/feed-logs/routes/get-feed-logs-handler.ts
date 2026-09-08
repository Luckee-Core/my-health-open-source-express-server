import type { Request, Response } from 'express';
import { processGetAllFeedLogs } from '../process-get-all-feed-logs';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/feed-logs.
 */
export const getFeedLogsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/feed-logs');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processGetAllFeedLogs(pool);
    console.log('✅ GET /api/data/feed-logs');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/feed-logs');
  }
};
