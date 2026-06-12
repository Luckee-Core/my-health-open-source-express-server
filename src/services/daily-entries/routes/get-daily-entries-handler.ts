import type { Request, Response } from 'express';
import { getAllDailyEntries } from '../../../data/daily-entries';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/daily-entries.
 */
export const getDailyEntriesHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/daily-entries');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await getAllDailyEntries(pool);
    console.log('📤 GET /api/data/daily-entries');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/daily-entries');
  }
};
