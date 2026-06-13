import type { Request, Response } from 'express';
import { processDeleteFocusAreaById } from '../process-delete-focus-area-by-id';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/focus-areas/:id.
 */
export const deleteFocusAreaHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/focus-areas/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    await processDeleteFocusAreaById(pool, id);
    console.log('✅ DELETE /api/data/focus-areas/:id');
    console.log('📤 DELETE /api/data/focus-areas/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/focus-areas/:id');
  }
};
