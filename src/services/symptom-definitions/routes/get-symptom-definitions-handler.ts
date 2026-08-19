import type { Request, Response } from 'express';
import { getAllSymptomDefinitions } from '../../../data/symptom-definitions';
import {
  requirePgPool,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles GET /api/data/symptom-definitions.
 */
export const getSymptomDefinitionsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/symptom-definitions');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await getAllSymptomDefinitions(pool);
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/symptom-definitions');
  }
};
