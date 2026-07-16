import type { Request, Response } from 'express';
import { processDeleteAllergy } from '../process-delete-allergy';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/allergies/:id.
 */
export const deleteAllergyHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/allergies/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    await processDeleteAllergy(pool, id);
    console.log('✅ DELETE /api/data/allergies/:id');
    console.log('📤 DELETE /api/data/allergies/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/allergies/:id');
  }
};
