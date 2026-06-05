import type { Request, Response } from 'express';
import { updateDoctorById } from '../../../data/doctors';
import type { UpdateDoctorInput } from '../../../data/doctors';
import {
  parseRouteId,
  requireSupabase,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/doctors/:id.
 */
export const patchDoctorHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/doctors/:id');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    const updated = await updateDoctorById(supabase, id, req.body as UpdateDoctorInput);
    console.log('📤 PATCH /api/data/doctors/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/doctors/:id');
  }
};
