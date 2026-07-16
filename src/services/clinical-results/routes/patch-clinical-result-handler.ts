import type { Request, Response } from 'express';
import { processUpdateClinicalResult } from '../process-update-clinical-result';
import type { UpdateClinicalResultInput } from '../../../data/clinical-results';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/clinical-results/:id.
 */
export const patchClinicalResultHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/clinical-results/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    const updated = await processUpdateClinicalResult(pool, id, req.body as UpdateClinicalResultInput);
    console.log('✅ PATCH /api/data/clinical-results/:id');
    console.log('📤 PATCH /api/data/clinical-results/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/clinical-results/:id');
  }
};
