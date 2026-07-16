import type { Request, Response } from 'express';
import { processListVitalSigns } from '../process-list-vital-signs';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/vital-signs.
 */
export const getVitalSignsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/vital-signs');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processListVitalSigns(pool);
    console.log('✅ GET /api/data/vital-signs');
    console.log('📤 GET /api/data/vital-signs');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/vital-signs');
  }
};
