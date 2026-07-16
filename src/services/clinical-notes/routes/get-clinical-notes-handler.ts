import type { Request, Response } from 'express';
import { processListClinicalNotes } from '../process-list-clinical-notes';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/clinical-notes.
 */
export const getClinicalNotesHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/clinical-notes');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processListClinicalNotes(pool);
    console.log('✅ GET /api/data/clinical-notes');
    console.log('📤 GET /api/data/clinical-notes');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/clinical-notes');
  }
};
