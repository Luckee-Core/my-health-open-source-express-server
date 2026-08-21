import type { Request, Response } from 'express';
import { getMedicationDoseSchedule } from '../../../data/medication-dose-schedules';
import {
  requirePgPool,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

const readMedicationId = (value: string | string[]): string =>
  Array.isArray(value) ? value[0] : value;

/**
 * Handles GET /api/data/medications/:id/dose-schedule.
 */
export const getMedicationDoseScheduleHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const schedule = await getMedicationDoseSchedule(pool, readMedicationId(req.params.id));
    sendSuccess(res, schedule);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/medications/:id/dose-schedule');
  }
};
