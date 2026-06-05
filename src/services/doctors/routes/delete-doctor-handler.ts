import type { Request, Response } from 'express';
import { deleteDoctorById } from '../../../data/doctors';
import {
  parseRouteId,
  requireSupabase,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/doctors/:id.
 */
export const deleteDoctorHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/doctors/:id');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    await deleteDoctorById(supabase, id);
    console.log('📤 DELETE /api/data/doctors/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/doctors/:id');
  }
};
