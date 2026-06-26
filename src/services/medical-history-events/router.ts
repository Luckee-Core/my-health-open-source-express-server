import { Router } from 'express';
import { deleteMedicalHistoryEventHandler } from './routes/delete-medical-history-event-handler';
import { getMedicalHistoryEventsHandler } from './routes/get-medical-history-events-handler';
import { patchMedicalHistoryEventHandler } from './routes/patch-medical-history-event-handler';
import { postMedicalHistoryEventHandler } from './routes/post-medical-history-event-handler';

/**
 * Factory for medical history events router.
 */
export const createMedicalHistoryEventsRouter = (): Router => {
  const router = Router();
  router.get('/', getMedicalHistoryEventsHandler);
  router.post('/', postMedicalHistoryEventHandler);
  router.patch('/:id', patchMedicalHistoryEventHandler);
  router.delete('/:id', deleteMedicalHistoryEventHandler);
  return router;
};
