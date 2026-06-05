import { Router } from 'express';
import { createAppointmentsRouter } from '../appointments';
import { createDailyEntriesRouter } from '../daily-entries';
import { createDoctorsRouter } from '../doctors';
import { createFocusAreasRouter } from '../focus-areas';
import { createHospitalsRouter } from '../hospitals';
import { createSpecialtiesRouter } from '../specialties';

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
  return router;
};
