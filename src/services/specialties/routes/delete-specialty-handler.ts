import type { Request, Response } from 'express';
import { processDeleteSpecialtyById } from '../process-delete-specialty-by-id';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/specialties/:id.
 */
export const deleteSpecialtyHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/specialties/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    await processDeleteSpecialtyById(pool, id);
    console.log('✅ DELETE /api/data/specialties/:id');
    console.log('📤 DELETE /api/data/specialties/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/specialties/:id');
  }
};
