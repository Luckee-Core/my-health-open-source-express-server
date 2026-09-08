import type { Request, Response } from 'express';
import type { IncrementTherapyExerciseLogInput } from '../../../model/therapy-exercise-log';
import { processIncrementTherapyExerciseLog } from '../process-increment-therapy-exercise-log';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/therapy-exercise-logs/increment.
 */
export const postIncrementTherapyExerciseLogHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/therapy-exercise-logs/increment');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as IncrementTherapyExerciseLogInput;
  if (!body?.exercise_id?.trim()) {
    sendClientError(res, 'exercise_id is required');
    return;
  }
  if (!body?.log_date?.trim()) {
    sendClientError(res, 'log_date is required');
    return;
  }
  if (!Number.isFinite(body.delta) || body.delta === 0) {
    sendClientError(res, 'delta must be a non-zero number');
    return;
  }

  try {
    const log = await processIncrementTherapyExerciseLog(pool, body);
    console.log('✅ POST /api/data/therapy-exercise-logs/increment');
    sendSuccess(res, log);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/therapy-exercise-logs/increment');
  }
};
