import type { Request, Response } from 'express';
import { processDeleteClinicalNote } from '../process-delete-clinical-note';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/clinical-notes/:id.
 */
export const deleteClinicalNoteHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/clinical-notes/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    await processDeleteClinicalNote(pool, id);
    console.log('✅ DELETE /api/data/clinical-notes/:id');
    console.log('📤 DELETE /api/data/clinical-notes/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/clinical-notes/:id');
  }
};
