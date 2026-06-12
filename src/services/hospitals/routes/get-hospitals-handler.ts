import type { Request, Response } from 'express';
import { getAllHospitals } from '../../../data/hospitals';
import {
  requirePgPool,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles GET /api/data/hospitals.
 */
export const getHospitalsHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/hospitals');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const rows = await getAllHospitals(pool);
    console.log('📤 GET /api/data/hospitals');
    sendSuccess(res, rows);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/hospitals');
  }
};
