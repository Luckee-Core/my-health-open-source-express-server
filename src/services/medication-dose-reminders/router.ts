import { Router } from 'express';
import { getMedicationDoseRemindersHandler } from './routes/get-medication-dose-reminders-handler';

/**
 * Factory for medication dose reminder router.
 */
export const createMedicationDoseRemindersRouter = (): Router => {
  const router = Router();
  router.get('/', getMedicationDoseRemindersHandler);
  return router;
};
