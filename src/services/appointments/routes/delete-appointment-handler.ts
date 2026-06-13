import type { Request, Response } from 'express';
import { processDeleteAppointmentById } from '../process-delete-appointment-by-id';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/appointments/:id.
 */
export const deleteAppointmentHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/appointments/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    await processDeleteAppointmentById(pool, id);
    console.log('✅ DELETE /api/data/appointments/:id');
    console.log('📤 DELETE /api/data/appointments/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/appointments/:id');
  }
};
