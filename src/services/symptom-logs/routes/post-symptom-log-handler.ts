import type { Request, Response } from 'express';
import { processCreateSymptomLog } from '../process-create-symptom-log';
import type { CreateSymptomLogInput } from '../../../data/symptom-logs';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/symptom-logs.
 */
export const postSymptomLogHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/symptom-logs');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateSymptomLogInput;
  if (!body?.name?.trim()) {
    sendClientError(res, 'name is required');
    return;
  }

  try {
    const created = await processCreateSymptomLog(pool, body);
    console.log('✅ POST /api/data/symptom-logs');
    console.log('📤 POST /api/data/symptom-logs');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/symptom-logs');
  }
};
