import { Router } from 'express';
import { deleteDoctorHandler } from './routes/delete-doctor-handler';
import { getDoctorsHandler } from './routes/get-doctors-handler';
import { patchDoctorHandler } from './routes/patch-doctor-handler';
import { postDoctorHandler } from './routes/post-doctor-handler';

/**
 * Factory for doctors router.
 */
export const createDoctorsRouter = (): Router => {
  const router = Router();
  router.get('/', getDoctorsHandler);
  router.post('/', postDoctorHandler);
  router.patch('/:id', patchDoctorHandler);
  router.delete('/:id', deleteDoctorHandler);
  return router;
};
