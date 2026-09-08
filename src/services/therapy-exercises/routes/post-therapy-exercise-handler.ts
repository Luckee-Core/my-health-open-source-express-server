import type { Request, Response } from 'express';
import type { CreateTherapyExerciseInput } from '../../../model/therapy-exercise';
import { processCreateTherapyExercise } from '../process-create-therapy-exercise';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/therapy-exercises.
 */
export const postTherapyExerciseHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/therapy-exercises');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateTherapyExerciseInput;
  if (!body?.name?.trim()) {
    sendClientError(res, 'name is required');
    return;
  }
  if (!body?.tracking_kind) {
    sendClientError(res, 'tracking_kind is required');
    return;
  }
  if (!Number.isFinite(body.target_count) || body.target_count < 1) {
    sendClientError(res, 'target_count must be at least 1');
    return;
  }

  try {
    const created = await processCreateTherapyExercise(pool, body);
    console.log('✅ POST /api/data/therapy-exercises');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/therapy-exercises');
  }
};
