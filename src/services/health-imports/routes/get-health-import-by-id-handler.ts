import type { Request, Response } from 'express';
import { getHealthImportById } from '../../../data/health-imports';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles GET /api/data/health-imports/:id.
 */
export const getHealthImportByIdHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/health-imports/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    const row = await getHealthImportById(pool, id);
    if (!row) {
      sendClientError(res, 'health import not found');
      return;
    }
    console.log('✅ GET /api/data/health-imports/:id');
    sendSuccess(res, row);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/health-imports/:id');
  }
};
