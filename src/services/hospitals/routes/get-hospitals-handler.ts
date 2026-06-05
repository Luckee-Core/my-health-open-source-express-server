import type { Request, Response } from 'express';
import { getAllHospitals } from '../../../data/hospitals';
import {
  requireSupabase,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles GET /api/data/hospitals.
 */
export const getHospitalsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/hospitals');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  try {
    const rows = await getAllHospitals(supabase);
    console.log('📤 GET /api/data/hospitals');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/hospitals');
  }
};
