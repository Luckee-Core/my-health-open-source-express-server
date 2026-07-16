import type { Request, Response } from 'express';
import { processCreateClinicalResult } from '../process-create-clinical-result';
import type { CreateClinicalResultInput } from '../../../data/clinical-results';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/clinical-results.
 */
export const postClinicalResultHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/clinical-results');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateClinicalResultInput;
  if (!body?.name || (typeof body.name === 'string' && !body.name.trim())) {
    sendClientError(res, 'name is required');
    return;
  }

  try {
    const created = await processCreateClinicalResult(pool, body);
    console.log('✅ POST /api/data/clinical-results');
    console.log('📤 POST /api/data/clinical-results');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/clinical-results');
  }
};
