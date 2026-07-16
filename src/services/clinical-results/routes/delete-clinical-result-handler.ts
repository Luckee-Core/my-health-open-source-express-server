import type { Request, Response } from 'express';
import { processDeleteClinicalResult } from '../process-delete-clinical-result';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/clinical-results/:id.
 */
export const deleteClinicalResultHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/clinical-results/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    await processDeleteClinicalResult(pool, id);
    console.log('✅ DELETE /api/data/clinical-results/:id');
    console.log('📤 DELETE /api/data/clinical-results/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/clinical-results/:id');
  }
};
