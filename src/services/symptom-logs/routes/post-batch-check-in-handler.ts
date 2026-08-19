import type { Request, Response } from 'express';
import { processBatchCheckIn } from '../process-batch-check-in';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/symptom-logs/batch-check-in.
 */
export const postBatchCheckInHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/symptom-logs/batch-check-in');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as { entries?: unknown };
  if (!Array.isArray(body.entries) || body.entries.length === 0) {
    sendClientError(res, 'entries array is required');
    return;
  }

  try {
    const created = await processBatchCheckIn(pool, body.entries as never);
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/symptom-logs/batch-check-in');
  }
};
