import type { Request, Response } from 'express';
import { processDeleteTherapyExerciseById } from '../process-delete-therapy-exercise-by-id';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/therapy-exercises/:id.
 */
export const deleteTherapyExerciseHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 DELETE /api/data/therapy-exercises/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    await processDeleteTherapyExerciseById(pool, id);
    console.log('✅ DELETE /api/data/therapy-exercises/:id');
    sendSuccess(res, { id });
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/therapy-exercises/:id');
  }
};
