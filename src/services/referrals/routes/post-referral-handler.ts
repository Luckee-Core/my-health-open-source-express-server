import type { Request, Response } from 'express';
import { processCreateReferral } from '../process-create-referral';
import type { CreateReferralInput } from '../../../model/referral';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/referrals.
 */
export const postReferralHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/referrals');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateReferralInput;


  try {
    const created = await processCreateReferral(pool, body);
    console.log('✅ POST /api/data/referrals');
    console.log('📤 POST /api/data/referrals');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/referrals');
  }
};
