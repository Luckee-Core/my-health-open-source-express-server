import type { Request, Response } from 'express';
import { deleteAppointmentById } from '../../../data/appointments';
import {
  parseRouteId,
  requireSupabase,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/appointments/:id.
 */
export const deleteAppointmentHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/appointments/:id');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    await deleteAppointmentById(supabase, id);
    console.log('📤 DELETE /api/data/appointments/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/appointments/:id');
  }
};
