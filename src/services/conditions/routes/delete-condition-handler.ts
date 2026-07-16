import type { Request, Response } from 'express';
import { processDeleteCondition } from '../process-delete-condition';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/conditions/:id.
 */
export const deleteConditionHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/conditions/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    await processDeleteCondition(pool, id);
    console.log('✅ DELETE /api/data/conditions/:id');
    console.log('📤 DELETE /api/data/conditions/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/conditions/:id');
  }
};
