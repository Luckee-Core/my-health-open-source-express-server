import type { Request, Response } from 'express';
import { processUpdateMedication } from '../process-update-medication';
import type { UpdateMedicationInput } from '../../../data/medications';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/medications/:id.
 */
export const patchMedicationHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/medications/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    const updated = await processUpdateMedication(pool, id, req.body as UpdateMedicationInput);
    console.log('✅ PATCH /api/data/medications/:id');
    console.log('📤 PATCH /api/data/medications/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/medications/:id');
  }
};
