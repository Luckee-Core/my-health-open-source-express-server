import type { Request, Response } from 'express';
import { processUpdateReferral } from '../process-update-referral';
import type { UpdateReferralInput } from '../../../model/referral';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/referrals/:id.
 */
export const patchReferralHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/referrals/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    const updated = await processUpdateReferral(pool, id, req.body as UpdateReferralInput);
    console.log('✅ PATCH /api/data/referrals/:id');
    console.log('📤 PATCH /api/data/referrals/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/referrals/:id');
  }
};
