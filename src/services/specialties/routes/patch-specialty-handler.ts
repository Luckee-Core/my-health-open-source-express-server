import type { Request, Response } from 'express';
import { processUpdateSpecialtyById } from '../process-update-specialty-by-id';
import type { UpdateSpecialtyInput } from '../../../data/specialties';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/specialties/:id.
 */
export const patchSpecialtyHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/specialties/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    const updated = await processUpdateSpecialtyById(pool, id, req.body as UpdateSpecialtyInput);
    console.log('✅ PATCH /api/data/specialties/:id');
    console.log('📤 PATCH /api/data/specialties/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/specialties/:id');
  }
};
