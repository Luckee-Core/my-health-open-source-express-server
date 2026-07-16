import type { Request, Response } from 'express';
import { processCreateInsuranceCoverage } from '../process-create-insurance-coverage';
import type { CreateInsuranceCoverageInput } from '../../../data/insurance-coverages';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/insurance-coverages.
 */
export const postInsuranceCoverageHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/insurance-coverages');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateInsuranceCoverageInput;
  if (!body?.payer_name || (typeof body.payer_name === 'string' && !body.payer_name.trim())) {
    sendClientError(res, 'payer_name is required');
    return;
  }

  try {
    const created = await processCreateInsuranceCoverage(pool, body);
    console.log('✅ POST /api/data/insurance-coverages');
    console.log('📤 POST /api/data/insurance-coverages');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/insurance-coverages');
  }
};
