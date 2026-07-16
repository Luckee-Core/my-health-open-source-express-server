import { Router } from 'express';
import { deleteMedicationHandler } from './routes/delete-medication-handler';
import { getMedicationsHandler } from './routes/get-medications-handler';
import { patchMedicationHandler } from './routes/patch-medication-handler';
import { postMedicationHandler } from './routes/post-medication-handler';

/**
 * Factory for medications router.
 */
export const createMedicationsRouter = (): Router => {
  const router = Router();
  router.get('/', getMedicationsHandler);
  router.post('/', postMedicationHandler);
  router.patch('/:id', patchMedicationHandler);
  router.delete('/:id', deleteMedicationHandler);
  return router;
};
