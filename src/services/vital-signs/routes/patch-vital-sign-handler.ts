import type { Request, Response } from 'express';
import { processUpdateVitalSign } from '../process-update-vital-sign';
import type { UpdateVitalSignInput } from '../../../data/vital-signs';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/vital-signs/:id.
 */
export const patchVitalSignHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/vital-signs/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    const updated = await processUpdateVitalSign(pool, id, req.body as UpdateVitalSignInput);
    console.log('✅ PATCH /api/data/vital-signs/:id');
    console.log('📤 PATCH /api/data/vital-signs/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/vital-signs/:id');
  }
};
