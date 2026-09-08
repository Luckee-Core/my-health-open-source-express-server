import type { Request, Response } from 'express';
import { processGetAllSpeechTherapyConsumption } from '../process-get-all-speech-therapy-consumption';
import {
  requirePgPool,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles GET /api/data/speech-therapy-consumption.
 */
export const getSpeechTherapyConsumptionHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/speech-therapy-consumption');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processGetAllSpeechTherapyConsumption(pool);
    console.log('✅ GET /api/data/speech-therapy-consumption');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/speech-therapy-consumption');
  }
};
