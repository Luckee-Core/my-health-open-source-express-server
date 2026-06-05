import { Router } from 'express';
import { deleteAppointmentHandler } from './routes/delete-appointment-handler';
import { getAppointmentsHandler } from './routes/get-appointments-handler';
import { patchAppointmentHandler } from './routes/patch-appointment-handler';
import { postAppointmentHandler } from './routes/post-appointment-handler';

/**
 * Factory for appointments router.
 */
export const createAppointmentsRouter = (): Router => {
  const router = Router();
  router.get('/', getAppointmentsHandler);
  router.post('/', postAppointmentHandler);
  router.patch('/:id', patchAppointmentHandler);
  router.delete('/:id', deleteAppointmentHandler);
  return router;
};
