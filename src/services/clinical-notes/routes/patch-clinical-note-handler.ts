import type { Request, Response } from 'express';
import { processUpdateClinicalNote } from '../process-update-clinical-note';
import type { UpdateClinicalNoteInput } from '../../../model/clinical-note';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/clinical-notes/:id.
 */
export const patchClinicalNoteHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/clinical-notes/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    const updated = await processUpdateClinicalNote(pool, id, req.body as UpdateClinicalNoteInput);
    console.log('✅ PATCH /api/data/clinical-notes/:id');
    console.log('📤 PATCH /api/data/clinical-notes/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/clinical-notes/:id');
  }
};
