import { Router } from 'express';
import { deleteSpecialtyHandler } from './routes/delete-specialty-handler';
import { getSpecialtiesHandler } from './routes/get-specialties-handler';
import { patchSpecialtyHandler } from './routes/patch-specialty-handler';
import { postSpecialtyHandler } from './routes/post-specialty-handler';

/**
 * Factory for specialties router.
 */
export const createSpecialtiesRouter = (): Router => {
  const router = Router();
  router.get('/', getSpecialtiesHandler);
  router.post('/', postSpecialtyHandler);
  router.patch('/:id', patchSpecialtyHandler);
  router.delete('/:id', deleteSpecialtyHandler);
  return router;
};
