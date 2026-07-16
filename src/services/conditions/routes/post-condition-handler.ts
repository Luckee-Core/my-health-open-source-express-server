import type { Request, Response } from 'express';
import { processCreateCondition } from '../process-create-condition';
import type { CreateConditionInput } from '../../../data/conditions';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/conditions.
 */
export const postConditionHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/conditions');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateConditionInput;
  if (!body?.name || (typeof body.name === 'string' && !body.name.trim())) {
    sendClientError(res, 'name is required');
    return;
  }

  try {
    const created = await processCreateCondition(pool, body);
    console.log('✅ POST /api/data/conditions');
    console.log('📤 POST /api/data/conditions');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/conditions');
  }
};
