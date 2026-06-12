import type { Request, Response } from 'express';
import { updateFocusAreaById } from '../../../data/focus-areas';
import type { UpdateFocusAreaInput } from '../../../data/focus-areas';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/focus-areas/:id.
 */
export const patchFocusAreaHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/focus-areas/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    const updated = await updateFocusAreaById(pool, id, req.body as UpdateFocusAreaInput);
    console.log('📤 PATCH /api/data/focus-areas/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/focus-areas/:id');
  }
};
