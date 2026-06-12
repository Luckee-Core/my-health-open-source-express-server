import type { Request, Response } from 'express';
import { deleteHospitalById } from '../../../data/hospitals';
import {
  parseRouteId,
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/hospitals/:id.
 */
export const deleteHospitalHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/hospitals/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = parseRouteId(req.params.id);
  if (!id) {
    sendClientError(res, 'Invalid id');
    return;
  }

  try {
    await deleteHospitalById(pool, id);
    console.log('📤 DELETE /api/data/hospitals/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/hospitals/:id');
  }
};
