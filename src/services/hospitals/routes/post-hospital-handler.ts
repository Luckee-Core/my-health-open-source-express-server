import type { Request, Response } from 'express';
import { processCreateHospital } from '../process-create-hospital';
import type { CreateHospitalInput } from '../../../data/hospitals';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/hospitals.
 */
export const postHospitalHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/hospitals');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateHospitalInput;
  if (!body?.name?.trim()) {
    sendClientError(res, 'name is required');
    return;
  }

  try {
    const created = await processCreateHospital(pool, body);
    console.log('✅ POST /api/data/hospitals');
    console.log('📤 POST /api/data/hospitals');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/hospitals');
  }
};
