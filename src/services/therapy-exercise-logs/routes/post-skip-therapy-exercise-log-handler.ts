import type { Request, Response } from 'express';
import type { SkipTherapyExerciseLogInput } from '../../../model/therapy-exercise-log';
import { processSkipTherapyExerciseLog } from '../process-skip-therapy-exercise-log';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/therapy-exercise-logs/skip.
 */
export const postSkipTherapyExerciseLogHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/therapy-exercise-logs/skip');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as SkipTherapyExerciseLogInput;
  if (!body?.exercise_id?.trim()) {
    sendClientError(res, 'exercise_id is required');
    return;
  }
  if (!body?.log_date?.trim()) {
    sendClientError(res, 'log_date is required');
    return;
  }
  if (typeof body.skipped !== 'boolean') {
    sendClientError(res, 'skipped must be a boolean');
    return;
  }

  try {
    const log = await processSkipTherapyExerciseLog(pool, body);
    console.log('✅ POST /api/data/therapy-exercise-logs/skip');
    sendSuccess(res, log);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/therapy-exercise-logs/skip');
  }
};
