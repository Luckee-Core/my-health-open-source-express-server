import type { Request, Response } from 'express';
import { getAllFocusAreas } from '../../../data/focus-areas';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/focus-areas.
 */
export const getFocusAreasHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/focus-areas');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await getAllFocusAreas(pool);
    console.log('📤 GET /api/data/focus-areas');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/focus-areas');
  }
};
