import type { Request, Response } from 'express';
import { getAllDoctors } from '../../../data/doctors';
import { requireSupabase, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/doctors.
 */
export const getDoctorsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/doctors');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  try {
    const rows = await getAllDoctors(supabase);
    console.log('📤 GET /api/data/doctors');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/doctors');
  }
};
