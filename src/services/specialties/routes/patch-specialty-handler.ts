import type { Request, Response } from 'express';
import { updateSpecialtyById } from '../../../data/specialties';
import type { UpdateSpecialtyInput } from '../../../data/specialties';
import {
  parseRouteId,
  requireSupabase,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/specialties/:id.
 */
export const patchSpecialtyHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/specialties/:id');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    const updated = await updateSpecialtyById(supabase, id, req.body as UpdateSpecialtyInput);
    console.log('📤 PATCH /api/data/specialties/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/specialties/:id');
  }
};
