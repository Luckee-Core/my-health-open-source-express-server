import type { Request, Response } from 'express';
import { processDeleteDoctorById } from '../process-delete-doctor-by-id';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/doctors/:id.
 */
export const deleteDoctorHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/doctors/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    await processDeleteDoctorById(pool, id);
    console.log('✅ DELETE /api/data/doctors/:id');
    console.log('📤 DELETE /api/data/doctors/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/doctors/:id');
  }
};
