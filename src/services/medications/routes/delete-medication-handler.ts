import type { Request, Response } from 'express';
import { processDeleteMedication } from '../process-delete-medication';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/medications/:id.
 */
export const deleteMedicationHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/medications/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    await processDeleteMedication(pool, id);
    console.log('✅ DELETE /api/data/medications/:id');
    console.log('📤 DELETE /api/data/medications/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/medications/:id');
  }
};
