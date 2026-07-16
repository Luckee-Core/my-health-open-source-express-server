import type { Request, Response } from 'express';
import { processListMedications } from '../process-list-medications';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/medications.
 */
export const getMedicationsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/medications');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processListMedications(pool);
    console.log('✅ GET /api/data/medications');
    console.log('📤 GET /api/data/medications');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/medications');
  }
};
