import type { Request, Response } from 'express';
import { processListReferrals } from '../process-list-referrals';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/referrals.
 */
export const getReferralsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/referrals');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processListReferrals(pool);
    console.log('✅ GET /api/data/referrals');
    console.log('📤 GET /api/data/referrals');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/referrals');
  }
};
