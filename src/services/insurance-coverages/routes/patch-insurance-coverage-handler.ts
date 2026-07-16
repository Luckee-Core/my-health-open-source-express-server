import type { Request, Response } from 'express';
import { processUpdateInsuranceCoverage } from '../process-update-insurance-coverage';
import type { UpdateInsuranceCoverageInput } from '../../../data/insurance-coverages';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles PATCH /api/data/insurance-coverages/:id.
 */
export const patchInsuranceCoverageHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 PATCH /api/data/insurance-coverages/:id');
  const pool = requirePgPool(res);
  if (!pool) return;

  const id = String(req.params.id ?? '');
  if (!id) {
    sendClientError(res, 'id is required');
    return;
  }

  try {
    const updated = await processUpdateInsuranceCoverage(pool, id, req.body as UpdateInsuranceCoverageInput);
    console.log('✅ PATCH /api/data/insurance-coverages/:id');
    console.log('📤 PATCH /api/data/insurance-coverages/:id');
    sendSuccess(res, updated);
  } catch (error) {
    sendHandlerError(res, error, 'PATCH /api/data/insurance-coverages/:id');
  }
};
