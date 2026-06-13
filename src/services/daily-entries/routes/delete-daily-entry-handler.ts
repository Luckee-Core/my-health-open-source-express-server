import type { Request, Response } from 'express';
import { processDeleteDailyEntryById } from '../process-delete-daily-entry-by-id';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/daily-entries/:id.
 */
export const deleteDailyEntryHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/daily-entries/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    await processDeleteDailyEntryById(pool, id);
    console.log('✅ DELETE /api/data/daily-entries/:id');
    console.log('📤 DELETE /api/data/daily-entries/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/daily-entries/:id');
  }
};
