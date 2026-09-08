import type { Request, Response } from 'express';
import type { IncrementSpeechTherapyConsumptionInput } from '../../../model/speech-therapy-consumption';
import { processIncrementSpeechTherapyConsumption } from '../process-increment-speech-therapy-consumption';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/speech-therapy-consumption/increment.
 */
export const postIncrementSpeechTherapyConsumptionHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/speech-therapy-consumption/increment');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as IncrementSpeechTherapyConsumptionInput;
  if (!body?.consumption_type?.trim()) {
    sendClientError(res, 'consumption_type is required');
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
    const row = await processIncrementSpeechTherapyConsumption(pool, body);
    console.log('✅ POST /api/data/speech-therapy-consumption/increment');
    sendSuccess(res, row);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/speech-therapy-consumption/increment');
  }
};
