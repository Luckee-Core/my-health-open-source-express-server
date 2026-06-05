import type { Request, Response } from 'express';
import { createFocusArea } from '../../../data/focus-areas';
import type { CreateFocusAreaInput } from '../../../data/focus-areas';
import {
  requireSupabase,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/focus-areas.
 */
export const postFocusAreaHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/focus-areas');
  const supabase = requireSupabase(res);
  if (!supabase) return;

  const body = req.body as CreateFocusAreaInput;
  if (!body?.name?.trim()) {
    sendClientError(res, 'name is required');
    return;
  }

  try {
    const created = await createFocusArea(supabase, body);
    console.log('📤 POST /api/data/focus-areas');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/focus-areas');
  }
};
