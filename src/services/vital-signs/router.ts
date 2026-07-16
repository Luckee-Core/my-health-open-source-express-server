import { Router } from 'express';
import { deleteVitalSignHandler } from './routes/delete-vital-sign-handler';
import { getVitalSignsHandler } from './routes/get-vital-signs-handler';
import { patchVitalSignHandler } from './routes/patch-vital-sign-handler';
import { postVitalSignHandler } from './routes/post-vital-sign-handler';

/**
 * Factory for vital-signs router.
 */
export const createVitalSignsRouter = (): Router => {
  const router = Router();
  router.get('/', getVitalSignsHandler);
  router.post('/', postVitalSignHandler);
  router.patch('/:id', patchVitalSignHandler);
  router.delete('/:id', deleteVitalSignHandler);
  return router;
};
