import type { Request, Response } from 'express';
import { processCreateFocusArea } from '../process-create-focus-area';
import type { CreateFocusAreaInput } from '../../../data/focus-areas';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/focus-areas.
 */
export const postFocusAreaHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/focus-areas');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateFocusAreaInput;
  if (!body?.name?.trim()) {
    sendClientError(res, 'name is required');
    return;
  }

  try {
    const created = await processCreateFocusArea(pool, body);
    console.log('✅ POST /api/data/focus-areas');
    console.log('📤 POST /api/data/focus-areas');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/focus-areas');
  }
};
