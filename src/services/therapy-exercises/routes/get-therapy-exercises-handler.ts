import type { Request, Response } from 'express';
import { processGetAllTherapyExercises } from '../process-get-all-therapy-exercises';
import {
  requirePgPool,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles GET /api/data/therapy-exercises.
 */
export const getTherapyExercisesHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/therapy-exercises');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processGetAllTherapyExercises(pool);
    console.log('✅ GET /api/data/therapy-exercises');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/therapy-exercises');
  }
};
