import type { Request, Response } from 'express';
import { processUpdateDoctorById } from '../process-update-doctor-by-id';
import type { UpdateDoctorInput } from '../../../data/doctors';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/doctors/:id.
 */
export const patchDoctorHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/doctors/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    const updated = await processUpdateDoctorById(pool, id, req.body as UpdateDoctorInput);
    console.log('✅ PATCH /api/data/doctors/:id');
    console.log('📤 PATCH /api/data/doctors/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/doctors/:id');
  }
};
