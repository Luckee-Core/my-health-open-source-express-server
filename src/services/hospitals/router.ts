import { Router } from 'express';
import { deleteHospitalHandler } from './routes/delete-hospital-handler';
import { getHospitalsHandler } from './routes/get-hospitals-handler';
import { patchHospitalHandler } from './routes/patch-hospital-handler';
import { postHospitalHandler } from './routes/post-hospital-handler';

/**
 * Factory for hospitals router.
 */
export const createHospitalsRouter = (): Router => {
  const router = Router();
  router.get('/', getHospitalsHandler);
  router.post('/', postHospitalHandler);
  router.patch('/:id', patchHospitalHandler);
  router.delete('/:id', deleteHospitalHandler);
  return router;
};
