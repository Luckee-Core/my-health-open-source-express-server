import { Router } from 'express';
import { deleteInsuranceCoverageHandler } from './routes/delete-insurance-coverage-handler';
import { getInsuranceCoveragesHandler } from './routes/get-insurance-coverages-handler';
import { patchInsuranceCoverageHandler } from './routes/patch-insurance-coverage-handler';
import { postInsuranceCoverageHandler } from './routes/post-insurance-coverage-handler';

/**
 * Factory for insurance-coverages router.
 */
export const createInsuranceCoveragesRouter = (): Router => {
  const router = Router();
  router.get('/', getInsuranceCoveragesHandler);
  router.post('/', postInsuranceCoverageHandler);
  router.patch('/:id', patchInsuranceCoverageHandler);
  router.delete('/:id', deleteInsuranceCoverageHandler);
  return router;
};
