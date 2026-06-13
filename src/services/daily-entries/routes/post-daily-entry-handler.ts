import type { Request, Response } from 'express';
import { processCreateDailyEntry } from '../process-create-daily-entry';
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
  if (!body?.focus_area_id?.trim()) {
    sendClientError(res, 'focus_area_id is required');
    return;
  }
  if (!body?.entry_date?.trim()) {
    sendClientError(res, 'entry_date is required');
    return;
  }

  try {
    const created = await processCreateDailyEntry(pool, body);
    console.log('✅ POST /api/data/daily-entries');
    console.log('📤 POST /api/data/daily-entries');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/daily-entries');
  }
};
