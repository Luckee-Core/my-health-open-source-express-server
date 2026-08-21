import type { Request, Response } from 'express';
import {
  deleteMedicationDoseSchedule,
  upsertMedicationDoseSchedule,
} from '../../../data/medication-dose-schedules';
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
 * Handles PUT /api/data/medications/:id/dose-schedule.
 */
export const putMedicationDoseScheduleHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const pool = requirePgPool(res);
  if (!pool) return;

  const medicationId = readMedicationId(req.params.id);
  const body = req.body as { interval_minutes?: number; reminder_enabled?: boolean };

  const intervalMinutes = Number(body.interval_minutes);
  if (!Number.isFinite(intervalMinutes) || intervalMinutes <= 0) {
    sendClientError(res, 'interval_minutes must be a positive number');
    return;
  }

  try {
    const medication = await getMedicationById(pool, medicationId);
    if (!medication) {
      sendClientError(res, 'medication not found');
      return;
    }

    const schedule = await upsertMedicationDoseSchedule(pool, medicationId, {
      interval_minutes: Math.round(intervalMinutes),
      reminder_enabled: body.reminder_enabled ?? true,
    });
    sendSuccess(res, schedule);
  } catch (error) {
    sendHandlerError(res, error, 'PUT /api/data/medications/:id/dose-schedule');
  }
};

/**
 * Handles DELETE /api/data/medications/:id/dose-schedule.
 */
export const deleteMedicationDoseScheduleHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    await deleteMedicationDoseSchedule(pool, readMedicationId(req.params.id));
    sendSuccess(res, null);
  } catch (error) {
    sendHandlerError(res, error, 'DELETE /api/data/medications/:id/dose-schedule');
  }
};
