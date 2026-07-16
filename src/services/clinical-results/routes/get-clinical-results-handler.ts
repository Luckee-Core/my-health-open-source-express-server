import type { Request, Response } from 'express';
import { processListClinicalResults } from '../process-list-clinical-results';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/clinical-results.
 */
export const getClinicalResultsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/clinical-results');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processListClinicalResults(pool);
    console.log('✅ GET /api/data/clinical-results');
    console.log('📤 GET /api/data/clinical-results');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/clinical-results');
  }
};
