import type { Request, Response } from 'express';
import { getAllHealthImports } from '../../../data/health-imports';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/health-imports.
 */
export const getHealthImportsHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/health-imports');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await getAllHealthImports(pool);
    console.log('✅ GET /api/data/health-imports');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/health-imports');
  }
};
