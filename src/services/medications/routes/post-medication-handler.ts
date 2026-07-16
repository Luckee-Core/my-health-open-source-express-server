import type { Request, Response } from 'express';
import { processCreateMedication } from '../process-create-medication';
import type { CreateMedicationInput } from '../../../data/medications';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/medications.
 */
export const postMedicationHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/medications');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateMedicationInput;
  if (!body?.name || (typeof body.name === 'string' && !body.name.trim())) {
    sendClientError(res, 'name is required');
    return;
  }

  try {
    const created = await processCreateMedication(pool, body);
    console.log('✅ POST /api/data/medications');
    console.log('📤 POST /api/data/medications');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/medications');
  }
};
