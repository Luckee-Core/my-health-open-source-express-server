import type { Request, Response } from 'express';
import { processCreateAllergy } from '../process-create-allergy';
import type { CreateAllergyInput } from '../../../model/allergy';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/allergies.
 */
export const postAllergyHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/allergies');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateAllergyInput;
  if (!body?.substance || (typeof body.substance === 'string' && !body.substance.trim())) {
    sendClientError(res, 'substance is required');
    return;
  }

  try {
    const created = await processCreateAllergy(pool, body);
    console.log('✅ POST /api/data/allergies');
    console.log('📤 POST /api/data/allergies');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/allergies');
  }
};
