import type { Request, Response } from 'express';
import { processDeleteFeedFormulaById } from '../process-delete-feed-formula-by-id';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/feed-formulas/:id.
 */
export const deleteFeedFormulaHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 DELETE /api/data/feed-formulas/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    await processDeleteFeedFormulaById(pool, id);
    console.log('✅ DELETE /api/data/feed-formulas/:id');
    sendSuccess(res, { id });
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/feed-formulas/:id');
  }
};
