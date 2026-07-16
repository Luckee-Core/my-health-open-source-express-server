import type { Request, Response } from 'express';
import { processListAllergies } from '../process-list-allergies';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/allergies.
 */
export const getAllergiesHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/allergies');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processListAllergies(pool);
    console.log('✅ GET /api/data/allergies');
    console.log('📤 GET /api/data/allergies');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/allergies');
  }
};
