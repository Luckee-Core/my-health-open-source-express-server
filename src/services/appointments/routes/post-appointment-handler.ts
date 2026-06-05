import type { Request, Response } from 'express';
import { createAppointment } from '../../../data/appointments';
import type { CreateAppointmentInput } from '../../../data/appointments';
import {
  requireSupabase,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/appointments.
 */
export const postAppointmentHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/appointments');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  const body = req.body as CreateAppointmentInput;
  if (!body?.doctor_id?.trim()) {
    sendClientError(res, 'doctor_id is required');
    return;
  }
  if (!body?.scheduled_at?.trim()) {
    sendClientError(res, 'scheduled_at is required');
    return;
  }

  try {
    const created = await createAppointment(supabase, body);
    console.log('📤 POST /api/data/appointments');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/appointments');
  }
};
