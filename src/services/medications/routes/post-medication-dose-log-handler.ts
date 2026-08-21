import type { Request, Response } from 'express';
import { createMedicationDoseLog } from '../../../data/medication-dose-logs';
import { getMedicationById } from '../../../data/medications/get-medication-by-id';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

const readMedicationId = (value: string | string[]): string =>
  Array.isArray(value) ? value[0] : value;

/**
 * Handles POST /api/data/medications/:id/dose-logs.
 */
export const postMedicationDoseLogHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/medications/:id/dose-logs');
  const pool = requirePgPool(res);
  if (!pool) return;

  const medicationId = readMedicationId(req.params.id);
  const body = req.body as { notes?: string | null; taken_at?: string };

  try {
    const medication = await getMedicationById(pool, medicationId);
    if (!medication) {
      sendClientError(res, 'medication not found');
      return;
    }

    const log = await createMedicationDoseLog(pool, medicationId, {
      notes: body.notes ?? null,
      taken_at: body.taken_at,
    });
    console.log('✅ POST /api/data/medications/:id/dose-logs');
    sendSuccess(res, log);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/medications/:id/dose-logs');
  }
};
