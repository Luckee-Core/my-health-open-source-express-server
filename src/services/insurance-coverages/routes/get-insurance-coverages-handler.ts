import type { Request, Response } from 'express';
import { processListInsuranceCoverages } from '../process-list-insurance-coverages';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/insurance-coverages.
 */
export const getInsuranceCoveragesHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/insurance-coverages');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processListInsuranceCoverages(pool);
    console.log('✅ GET /api/data/insurance-coverages');
    console.log('📤 GET /api/data/insurance-coverages');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/insurance-coverages');
  }
};
