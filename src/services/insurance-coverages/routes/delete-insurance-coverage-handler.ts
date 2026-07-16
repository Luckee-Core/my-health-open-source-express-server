import type { Request, Response } from 'express';
import { processDeleteInsuranceCoverage } from '../process-delete-insurance-coverage';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles DELETE /api/data/insurance-coverages/:id.
 */
export const deleteInsuranceCoverageHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 DELETE /api/data/insurance-coverages/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    await processDeleteInsuranceCoverage(pool, id);
    console.log('✅ DELETE /api/data/insurance-coverages/:id');
    console.log('📤 DELETE /api/data/insurance-coverages/:id');
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/insurance-coverages/:id');
  }
};
