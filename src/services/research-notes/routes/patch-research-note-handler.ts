import type { Request, Response } from 'express';
import { processUpdateResearchNoteById } from '../process-update-research-note-by-id';
import type { UpdateResearchNoteInput } from '../../../data/research-notes';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/research-notes/:id.
 */
export const patchResearchNoteHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/research-notes/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    const updated = await processUpdateResearchNoteById(
      pool,
      id,
      req.body as UpdateResearchNoteInput,
    );
    console.log('✅ PATCH /api/data/research-notes/:id');
    console.log('📤 PATCH /api/data/research-notes/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/research-notes/:id');
  }
};
