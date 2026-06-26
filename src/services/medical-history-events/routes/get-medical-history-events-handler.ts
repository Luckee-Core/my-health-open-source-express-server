import type { Request, Response } from 'express';
import { processGetAllMedicalHistoryEvents } from '../process-get-all-medical-history-events';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/medical-history-events.
 */
export const getMedicalHistoryEventsHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/medical-history-events');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processGetAllMedicalHistoryEvents(pool);
    console.log('✅ GET /api/data/medical-history-events');
    console.log('📤 GET /api/data/medical-history-events');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/medical-history-events');
  }
};
