import type { Request, Response } from 'express';
import { processCreateMedicalHistoryEvent } from '../process-create-medical-history-event';
import type { CreateMedicalHistoryEventInput } from '../../../data/medical-history-events';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/medical-history-events.
 */
export const postMedicalHistoryEventHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/medical-history-events');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateMedicalHistoryEventInput;
  if (!body?.event_date?.trim()) {
    sendClientError(res, 'event_date is required');
    return;
  }
  if (!body?.title?.trim()) {
    sendClientError(res, 'title is required');
    return;
  }

  try {
    const created = await processCreateMedicalHistoryEvent(pool, body);
    console.log('✅ POST /api/data/medical-history-events');
    console.log('📤 POST /api/data/medical-history-events');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/medical-history-events');
  }
};
