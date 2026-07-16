import type { Request, Response } from 'express';
import { processListConditions } from '../process-list-conditions';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/conditions.
 */
export const getConditionsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/conditions');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processListConditions(pool);
    console.log('✅ GET /api/data/conditions');
    console.log('📤 GET /api/data/conditions');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/conditions');
  }
};
