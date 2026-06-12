import type { Request, Response } from 'express';
import { createSpecialty } from '../../../data/specialties';
import type { CreateSpecialtyInput } from '../../../data/specialties';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/specialties.
 */
export const postSpecialtyHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 POST /api/data/specialties');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CreateSpecialtyInput;
  if (!body?.name?.trim()) {
    sendClientError(res, 'name is required');
    return;
  }

  try {
    const created = await createSpecialty(pool, body);
    console.log('📤 POST /api/data/specialties');
    sendSuccess(res, created);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/specialties');
  }
};
