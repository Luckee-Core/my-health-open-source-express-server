import type { Request, Response } from 'express';
import { getAllSpecialties } from '../../../data/specialties';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/specialties.
 */
export const getSpecialtiesHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/specialties');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await getAllSpecialties(pool);
    console.log('📤 GET /api/data/specialties');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/specialties');
  }
};
