import type { Request, Response } from 'express';
import { processGetAllTherapyExerciseImportAiExchanges } from '../process-get-all-therapy-exercise-import-ai-exchanges';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/therapy-exercise-import-ai-exchanges.
 */
export const getTherapyExerciseImportAiExchangesHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/therapy-exercise-import-ai-exchanges');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processGetAllTherapyExerciseImportAiExchanges(pool);
    console.log('✅ GET /api/data/therapy-exercise-import-ai-exchanges');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/therapy-exercise-import-ai-exchanges');
  }
};
