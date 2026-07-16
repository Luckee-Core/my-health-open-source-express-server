import type { Request, Response } from 'express';
import { processCreateClinicalNote } from '../process-create-clinical-note';
import type { CreateClinicalNoteInput } from '../../../data/clinical-notes';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/clinical-notes.
 */
export const postClinicalNoteHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/clinical-notes');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateClinicalNoteInput;
  if (!body?.note_at || (typeof body.note_at === 'string' && !body.note_at.trim())) {
    sendClientError(res, 'note_at is required');
    return;
  }
  if (!body?.title || (typeof body.title === 'string' && !body.title.trim())) {
    sendClientError(res, 'title is required');
    return;
  }
  if (!body?.body || (typeof body.body === 'string' && !body.body.trim())) {
    sendClientError(res, 'body is required');
    return;
  }

  try {
    const created = await processCreateClinicalNote(pool, body);
    console.log('✅ POST /api/data/clinical-notes');
    console.log('📤 POST /api/data/clinical-notes');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/clinical-notes');
  }
};
