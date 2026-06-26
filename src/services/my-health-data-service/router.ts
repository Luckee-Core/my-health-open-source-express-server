import { Router } from 'express';
import { createAppointmentsRouter } from '../appointments';
import { createDailyEntriesRouter } from '../daily-entries';
import { createDoctorsRouter } from '../doctors';
import { createFocusAreasRouter } from '../focus-areas';
import { createHospitalsRouter } from '../hospitals';
import { createMedicalHistoryEventsRouter } from '../medical-history-events';
import { createResearchNotesRouter } from '../research-notes';
import { createSpecialtiesRouter } from '../specialties';
import { createSymptomLogsRouter } from '../symptom-logs';

/**
 * Aggregates all my-health data routers under /api/data.
 */
export const createMyHealthDataService = (): Router => {
  const router = Router();
  router.use('/hospitals', createHospitalsRouter());
  router.use('/specialties', createSpecialtiesRouter());
  router.use('/doctors', createDoctorsRouter());
  router.use('/appointments', createAppointmentsRouter());
  router.use('/focus-areas', createFocusAreasRouter());
  router.use('/daily-entries', createDailyEntriesRouter());
  router.use('/medical-history-events', createMedicalHistoryEventsRouter());
  router.use('/symptom-logs', createSymptomLogsRouter());
  router.use('/research-notes', createResearchNotesRouter());
  return router;
};
