import type { Request, Response } from 'express';
import { deleteAppointmentById } from '../../../data/appointments';
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
    await deleteAppointmentById(pool, id);
    console.log('📤 DELETE /api/data/appointments/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/appointments/:id');
  }
};
