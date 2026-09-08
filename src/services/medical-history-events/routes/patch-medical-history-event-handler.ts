import type { Request, Response } from 'express';
import { processUpdateMedicalHistoryEventById } from '../process-update-medical-history-event-by-id';
import type { UpdateMedicalHistoryEventInput } from '../../../model/medical-history-event';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/medical-history-events/:id.
 */
export const patchMedicalHistoryEventHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 PATCH /api/data/medical-history-events/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    const updated = await processUpdateMedicalHistoryEventById(
      pool,
      id,
      req.body as UpdateMedicalHistoryEventInput,
    );
    console.log('✅ PATCH /api/data/medical-history-events/:id');
    console.log('📤 PATCH /api/data/medical-history-events/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/medical-history-events/:id');
  }
};
