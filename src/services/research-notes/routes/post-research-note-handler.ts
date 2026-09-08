import type { Request, Response } from 'express';
import { processCreateResearchNote } from '../process-create-research-note';
import type { CreateResearchNoteInput } from '../../../model/research-note';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/research-notes.
 */
export const postResearchNoteHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/research-notes');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateResearchNoteInput;
  if (!body?.title?.trim()) {
    sendClientError(res, 'title is required');
    return;
  }

  try {
    const created = await processCreateResearchNote(pool, body);
    console.log('✅ POST /api/data/research-notes');
    console.log('📤 POST /api/data/research-notes');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/research-notes');
  }
};
