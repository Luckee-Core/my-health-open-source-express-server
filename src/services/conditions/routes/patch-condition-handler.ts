import type { Request, Response } from 'express';
import { processUpdateCondition } from '../process-update-condition';
import type { UpdateConditionInput } from '../../../data/conditions';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/conditions/:id.
 */
export const patchConditionHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/conditions/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    const updated = await processUpdateCondition(pool, id, req.body as UpdateConditionInput);
    console.log('✅ PATCH /api/data/conditions/:id');
    console.log('📤 PATCH /api/data/conditions/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/conditions/:id');
  }
};
