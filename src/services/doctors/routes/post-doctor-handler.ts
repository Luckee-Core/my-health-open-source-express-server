import type { Request, Response } from 'express';
import { createDoctor } from '../../../data/doctors';
import type { CreateDoctorInput } from '../../../data/doctors';
import {
  requireSupabase,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/doctors.
 */
export const postDoctorHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/doctors');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  const body = req.body as CreateDoctorInput;
  if (!body?.name?.trim()) {
    sendClientError(res, 'name is required');
    return;
  }
  if (!body?.hospital_id?.trim()) {
    sendClientError(res, 'hospital_id is required');
    return;
  }
  if (!body?.specialty_id?.trim()) {
    sendClientError(res, 'specialty_id is required');
    return;
  }

  try {
    const created = await createDoctor(supabase, body);
    console.log('📤 POST /api/data/doctors');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/doctors');
  }
};
