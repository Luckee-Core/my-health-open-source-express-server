import type { Request, Response } from 'express';
import type { UpdateFeedFormulaInput } from '../../../model/feed-formula';
import { processUpdateFeedFormulaById } from '../process-update-feed-formula-by-id';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/feed-formulas/:id.
 */
export const patchFeedFormulaHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 PATCH /api/data/feed-formulas/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    const updated = await processUpdateFeedFormulaById(
      pool,
      id,
      req.body as UpdateFeedFormulaInput,
    );
    console.log('✅ PATCH /api/data/feed-formulas/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/feed-formulas/:id');
  }
};
