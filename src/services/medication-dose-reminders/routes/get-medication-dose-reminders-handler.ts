import type { Request, Response } from 'express';
import { listMedicationDoseReminders } from '../../../data/medication-dose-reminders';
import { requirePgPool, sendHandlerError, sendSuccess } from '../../../utils/http';

/**
 * Handles GET /api/data/medication-dose-reminders.
 */
export const getMedicationDoseRemindersHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/medication-dose-reminders');
  const pool = requirePgPool(res);
  if (!pool) return;

  try {
    const reminders = await listMedicationDoseReminders(pool);
    sendSuccess(res, reminders);
  } catch (error) {
    sendHandlerError(res, error, 'GET /api/data/medication-dose-reminders');
  }
};
