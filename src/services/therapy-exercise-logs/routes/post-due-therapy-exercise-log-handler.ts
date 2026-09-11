import type { Request, Response } from 'express';
import type { SetTherapyExerciseLogDueInput } from '../../../model/therapy-exercise-log';
import { processSetTherapyExerciseLogDue } from '../process-set-therapy-exercise-log-due';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/therapy-exercise-logs/due.
 */
export const postDueTherapyExerciseLogHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/therapy-exercise-logs/due');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as SetTherapyExerciseLogDueInput;
  if (!body?.exercise_id?.trim()) {
    sendClientError(res, 'exercise_id is required');
    return;
  }
  if (!body?.log_date?.trim()) {
    sendClientError(res, 'log_date is required');
    return;
  }
  if (typeof body.due !== 'boolean') {
    sendClientError(res, 'due must be a boolean');
    return;
  }

  try {
    const log = await processSetTherapyExerciseLogDue(pool, body);
    console.log('✅ POST /api/data/therapy-exercise-logs/due');
    sendSuccess(res, log);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/therapy-exercise-logs/due');
  }
};
