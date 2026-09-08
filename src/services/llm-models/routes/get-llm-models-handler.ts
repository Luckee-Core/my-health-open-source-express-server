import type { Request, Response } from 'express';
import { processGetAllLlmModels } from '../process-get-all-llm-models';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/llm-models.
 */
export const getLlmModelsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/llm-models');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await processGetAllLlmModels(pool);
    console.log('✅ GET /api/data/llm-models');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/llm-models');
  }
};
