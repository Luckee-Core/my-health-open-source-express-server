import type { Request, Response } from 'express';
import { getAllAppointments } from '../../../data/appointments';
import { requireSupabase, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/appointments.
 */
export const getAppointmentsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/appointments');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  try {
    const rows = await getAllAppointments(supabase);
    console.log('📤 GET /api/data/appointments');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/appointments');
  }
};
