import type { Request, Response } from 'express';
import { updateHospitalById } from '../../../data/hospitals';
import type { UpdateHospitalInput } from '../../../data/hospitals';
import {
  parseRouteId,
  requireSupabase,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/hospitals/:id.
 */
export const patchHospitalHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/hospitals/:id');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    const updated = await updateHospitalById(supabase, id, req.body as UpdateHospitalInput);
    console.log('📤 PATCH /api/data/hospitals/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/hospitals/:id');
  }
};
