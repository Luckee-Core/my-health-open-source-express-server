import type { Request, Response } from 'express';
import { processUpdateAllergy } from '../process-update-allergy';
import type { UpdateAllergyInput } from '../../../data/allergies';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/allergies/:id.
 */
export const patchAllergyHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/allergies/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    const updated = await processUpdateAllergy(pool, id, req.body as UpdateAllergyInput);
    console.log('✅ PATCH /api/data/allergies/:id');
    console.log('📤 PATCH /api/data/allergies/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/allergies/:id');
  }
};
