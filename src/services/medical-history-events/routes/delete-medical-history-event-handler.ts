import type { Request, Response } from 'express';
import { processDeleteMedicalHistoryEventById } from '../process-delete-medical-history-event-by-id';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/medical-history-events/:id.
 */
export const deleteMedicalHistoryEventHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 DELETE /api/data/medical-history-events/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    await processDeleteMedicalHistoryEventById(pool, id);
    console.log('✅ DELETE /api/data/medical-history-events/:id');
    console.log('📤 DELETE /api/data/medical-history-events/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/medical-history-events/:id');
  }
};
