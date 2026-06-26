import type { Request, Response } from 'express';
import { processGetAllSymptomLogs } from '../process-get-all-symptom-logs';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/symptom-logs.
 */
export const getSymptomLogsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/symptom-logs');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processGetAllSymptomLogs(pool);
    console.log('✅ GET /api/data/symptom-logs');
    console.log('📤 GET /api/data/symptom-logs');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/symptom-logs');
  }
};
