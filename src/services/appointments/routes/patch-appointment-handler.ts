import type { Request, Response } from 'express';
import { updateAppointmentById } from '../../../data/appointments';
import type { UpdateAppointmentInput } from '../../../data/appointments';
import {
  parseRouteId,
  requireSupabase,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/appointments/:id.
 */
export const patchAppointmentHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/appointments/:id');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    const updated = await updateAppointmentById(supabase, id, req.body as UpdateAppointmentInput);
    console.log('📤 PATCH /api/data/appointments/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/appointments/:id');
  }
};
