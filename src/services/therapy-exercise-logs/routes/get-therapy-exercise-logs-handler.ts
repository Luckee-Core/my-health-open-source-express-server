import type { Request, Response } from 'express';
import { processGetAllTherapyExerciseLogs } from '../process-get-all-therapy-exercise-logs';
import {
  requirePgPool,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles GET /api/data/therapy-exercise-logs.
 */
export const getTherapyExerciseLogsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/therapy-exercise-logs');
  const pool = requirePgPool(res);
  if (!pool) return;

  const logDate = typeof req.query.log_date === 'string' ? req.query.log_date : undefined;

  try {
    const rows = await processGetAllTherapyExerciseLogs(pool, { log_date: logDate });
    console.log('✅ GET /api/data/therapy-exercise-logs');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/therapy-exercise-logs');
  }
};
