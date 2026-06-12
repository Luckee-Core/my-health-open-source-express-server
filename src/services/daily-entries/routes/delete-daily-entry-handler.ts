import type { Request, Response } from 'express';
import { deleteDailyEntryById } from '../../../data/daily-entries';
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
    await deleteDailyEntryById(pool, id);
    console.log('📤 DELETE /api/data/daily-entries/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/daily-entries/:id');
  }
};
