import type { Request, Response } from 'express';
import { createHospital } from '../../../data/hospitals';
import type { CreateHospitalInput } from '../../../data/hospitals';
import {
  requireSupabase,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/hospitals.
 */
export const postHospitalHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/hospitals');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  const body = req.body as CreateHospitalInput;
  if (!body?.name?.trim()) {
    sendClientError(res, 'name is required');
    return;
  }

  try {
    const created = await createHospital(supabase, body);
    console.log('📤 POST /api/data/hospitals');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/hospitals');
  }
};
