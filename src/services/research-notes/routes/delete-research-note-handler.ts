import type { Request, Response } from 'express';
import { processDeleteResearchNoteById } from '../process-delete-research-note-by-id';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/research-notes/:id.
 */
export const deleteResearchNoteHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/research-notes/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    await processDeleteResearchNoteById(pool, id);
    console.log('✅ DELETE /api/data/research-notes/:id');
    console.log('📤 DELETE /api/data/research-notes/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/research-notes/:id');
  }
};
