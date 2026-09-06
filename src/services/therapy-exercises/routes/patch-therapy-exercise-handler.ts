import type { Request, Response } from 'express';
import type { UpdateTherapyExerciseInput } from '../../../data/therapy-exercises';
import { processUpdateTherapyExerciseById } from '../process-update-therapy-exercise-by-id';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/therapy-exercises/:id.
 */
export const patchTherapyExerciseHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 PATCH /api/data/therapy-exercises/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    const updated = await processUpdateTherapyExerciseById(
      pool,
      id,
      req.body as UpdateTherapyExerciseInput,
    );
    console.log('✅ PATCH /api/data/therapy-exercises/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/therapy-exercises/:id');
  }
};
