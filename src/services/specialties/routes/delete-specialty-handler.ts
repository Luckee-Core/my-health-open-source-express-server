import type { Request, Response } from 'express';
import { deleteSpecialtyById } from '../../../data/specialties';
import {
  parseRouteId,
  requireSupabase,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/specialties/:id.
 */
export const deleteSpecialtyHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/specialties/:id');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    await deleteSpecialtyById(supabase, id);
    console.log('📤 DELETE /api/data/specialties/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/specialties/:id');
  }
};
