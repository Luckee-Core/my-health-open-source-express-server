import type { Request, Response } from 'express';
import { createDailyEntry } from '../../../data/daily-entries';
import type { CreateDailyEntryInput } from '../../../data/daily-entries';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/daily-entries.
 */
export const postDailyEntryHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/daily-entries');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateDailyEntryInput;
  if (!body?.entry_date?.trim()) {
    sendClientError(res, 'entry_date is required');
    return;
  }
  if (!body?.focus_area_id?.trim()) {
    sendClientError(res, 'focus_area_id is required');
    return;
  }

  try {
    const created = await createDailyEntry(pool, body);
    console.log('📤 POST /api/data/daily-entries');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/daily-entries');
  }
};
