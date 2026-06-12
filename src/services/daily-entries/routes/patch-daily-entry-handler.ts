import type { Request, Response } from 'express';
import { updateDailyEntryById } from '../../../data/daily-entries';
import type { UpdateDailyEntryInput } from '../../../data/daily-entries';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/daily-entries/:id.
 */
export const patchDailyEntryHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/daily-entries/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    const updated = await updateDailyEntryById(pool, id, req.body as UpdateDailyEntryInput);
    console.log('📤 PATCH /api/data/daily-entries/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/daily-entries/:id');
  }
};
