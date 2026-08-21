import type { Request, Response } from 'express';
import { listSourceSystems } from '../../../data/source-instances';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/source-systems.
 */
export const getSourceSystemsHandler = async (req: Request, res: Response): Promise<void> => {
  const pool = requirePgPool(res);
  if (!pool) return;
  try {
    sendSuccess(res, await listSourceSystems(pool));
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/source-systems');
  }
};
