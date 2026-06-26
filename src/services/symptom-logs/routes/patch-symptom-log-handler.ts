import type { Request, Response } from 'express';
import { processUpdateSymptomLogById } from '../process-update-symptom-log-by-id';
import type { UpdateSymptomLogInput } from '../../../data/symptom-logs';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/symptom-logs/:id.
 */
export const patchSymptomLogHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/symptom-logs/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    const updated = await processUpdateSymptomLogById(pool, id, req.body as UpdateSymptomLogInput);
    console.log('✅ PATCH /api/data/symptom-logs/:id');
    console.log('📤 PATCH /api/data/symptom-logs/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/symptom-logs/:id');
  }
};
