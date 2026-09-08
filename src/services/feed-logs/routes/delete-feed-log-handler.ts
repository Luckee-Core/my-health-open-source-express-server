import type { Request, Response } from 'express';
import { processDeleteFeedLogById } from '../process-delete-feed-log-by-id';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/feed-logs/:id.
 */
export const deleteFeedLogHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/feed-logs/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    await processDeleteFeedLogById(pool, id);
    console.log('✅ DELETE /api/data/feed-logs/:id');
    sendSuccess(res, { id });
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/feed-logs/:id');
  }
};
