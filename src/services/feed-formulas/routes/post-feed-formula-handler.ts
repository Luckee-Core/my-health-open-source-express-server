import type { Request, Response } from 'express';
import type { CreateFeedFormulaInput } from '../../../model/feed-formula';
import { processCreateFeedFormula } from '../process-create-feed-formula';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/feed-formulas.
 */
export const postFeedFormulaHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/feed-formulas');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateFeedFormulaInput;
  if (!body?.brand?.trim()) {
    sendClientError(res, 'brand is required');
    return;
  }
  if (!body?.name?.trim()) {
    sendClientError(res, 'name is required');
    return;
  }
  if (body.calories_per_1000_ml === undefined || body.calories_per_1000_ml === null) {
    sendClientError(res, 'calories_per_1000_ml is required');
    return;
  }

  try {
    const created = await processCreateFeedFormula(pool, body);
    console.log('✅ POST /api/data/feed-formulas');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/feed-formulas');
  }
};
