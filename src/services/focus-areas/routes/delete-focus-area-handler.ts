import type { Request, Response } from 'express';
import { deleteFocusAreaById } from '../../../data/focus-areas';
import {
  parseRouteId,
  requireSupabase,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/focus-areas/:id.
 */
export const deleteFocusAreaHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/focus-areas/:id');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    await deleteFocusAreaById(supabase, id);
    console.log('📤 DELETE /api/data/focus-areas/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/focus-areas/:id');
  }
};
