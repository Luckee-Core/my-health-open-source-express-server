import type { Request, Response } from 'express';
import { processDeleteReferral } from '../process-delete-referral';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/referrals/:id.
 */
export const deleteReferralHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/referrals/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    await processDeleteReferral(pool, id);
    console.log('✅ DELETE /api/data/referrals/:id');
    console.log('📤 DELETE /api/data/referrals/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/referrals/:id');
  }
};
