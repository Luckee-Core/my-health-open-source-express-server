import type { Request, Response } from 'express';
import { processDeleteSymptomLogById } from '../process-delete-symptom-log-by-id';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/symptom-logs/:id.
 */
export const deleteSymptomLogHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/symptom-logs/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    await processDeleteSymptomLogById(pool, id);
    console.log('✅ DELETE /api/data/symptom-logs/:id');
    console.log('📤 DELETE /api/data/symptom-logs/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/symptom-logs/:id');
  }
};
