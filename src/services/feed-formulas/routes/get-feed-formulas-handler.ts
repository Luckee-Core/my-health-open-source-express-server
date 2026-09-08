import type { Request, Response } from 'express';
import { processGetAllFeedFormulas } from '../process-get-all-feed-formulas';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/feed-formulas.
 */
export const getFeedFormulasHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/feed-formulas');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processGetAllFeedFormulas(pool);
    console.log('✅ GET /api/data/feed-formulas');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/feed-formulas');
  }
};
