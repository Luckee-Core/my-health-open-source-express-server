import type { Request, Response } from 'express';
import type { UpsertFeedLogInput } from '../../../model/feed-log';
import { processUpsertFeedLog } from '../process-upsert-feed-log';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PUT /api/data/feed-logs.
 */
export const putFeedLogHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PUT /api/data/feed-logs');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as UpsertFeedLogInput;
  if (!body?.log_date?.trim()) {
    sendClientError(res, 'log_date is required');
    return;
  }
  if (!body?.formula_id?.trim()) {
    sendClientError(res, 'formula_id is required');
    return;
  }
  if (body.feed_left_ml === undefined || body.feed_left_ml === null) {
    sendClientError(res, 'feed_left_ml is required');
    return;
  }
  if (body.total_fed_ml === undefined || body.total_fed_ml === null) {
    sendClientError(res, 'total_fed_ml is required');
    return;
  }

  try {
    const row = await processUpsertFeedLog(pool, body);
    console.log('✅ PUT /api/data/feed-logs');
    sendSuccess(res, row);
  } catch (error) {
    sendHandlerError(res, error, 'PUT /api/data/feed-logs');
  }
};
