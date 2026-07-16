import { Router } from 'express';
import { deleteClinicalResultHandler } from './routes/delete-clinical-result-handler';
import { getClinicalResultsHandler } from './routes/get-clinical-results-handler';
import { patchClinicalResultHandler } from './routes/patch-clinical-result-handler';
import { postClinicalResultHandler } from './routes/post-clinical-result-handler';

/**
 * Factory for clinical-results router.
 */
export const createClinicalResultsRouter = (): Router => {
  const router = Router();
  router.get('/', getClinicalResultsHandler);
  router.post('/', postClinicalResultHandler);
  router.patch('/:id', patchClinicalResultHandler);
  router.delete('/:id', deleteClinicalResultHandler);
  return router;
};
