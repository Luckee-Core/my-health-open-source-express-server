import type { Request, Response } from 'express';
import { processGetAllResearchNotes } from '../process-get-all-research-notes';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/research-notes.
 */
export const getResearchNotesHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/research-notes');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processGetAllResearchNotes(pool);
    console.log('✅ GET /api/data/research-notes');
    console.log('📤 GET /api/data/research-notes');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/research-notes');
  }
};
