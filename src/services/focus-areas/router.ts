import { Router } from 'express';
import { deleteFocusAreaHandler } from './routes/delete-focus-area-handler';
import { getFocusAreasHandler } from './routes/get-focus-areas-handler';
import { patchFocusAreaHandler } from './routes/patch-focus-area-handler';
import { postFocusAreaHandler } from './routes/post-focus-area-handler';

/**
 * Factory for focus areas router.
 */
export const createFocusAreasRouter = (): Router => {
  const router = Router();
  router.get('/', getFocusAreasHandler);
  router.post('/', postFocusAreaHandler);
  router.patch('/:id', patchFocusAreaHandler);
  router.delete('/:id', deleteFocusAreaHandler);
  return router;
};
