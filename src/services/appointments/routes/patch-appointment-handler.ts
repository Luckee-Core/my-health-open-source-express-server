import type { Request, Response } from 'express';
import { processUpdateAppointmentById } from '../process-update-appointment-by-id';
import type { UpdateAppointmentInput } from '../../../data/appointments';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/appointments/:id.
 */
export const patchAppointmentHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/appointments/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    const updated = await processUpdateAppointmentById(pool, id, req.body as UpdateAppointmentInput);
    console.log('✅ PATCH /api/data/appointments/:id');
    console.log('📤 PATCH /api/data/appointments/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/appointments/:id');
  }
};
