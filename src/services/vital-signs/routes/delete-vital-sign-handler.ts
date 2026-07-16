import type { Request, Response } from 'express';
import { processDeleteVitalSign } from '../process-delete-vital-sign';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/vital-signs/:id.
 */
export const deleteVitalSignHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/vital-signs/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    await processDeleteVitalSign(pool, id);
    console.log('✅ DELETE /api/data/vital-signs/:id');
    console.log('📤 DELETE /api/data/vital-signs/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/vital-signs/:id');
  }
};
