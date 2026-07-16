import { Router } from 'express';
import { deleteConditionHandler } from './routes/delete-condition-handler';
import { getConditionsHandler } from './routes/get-conditions-handler';
import { patchConditionHandler } from './routes/patch-condition-handler';
import { postConditionHandler } from './routes/post-condition-handler';

/**
 * Factory for conditions router.
 */
export const createConditionsRouter = (): Router => {
  const router = Router();
  router.get('/', getConditionsHandler);
  router.post('/', postConditionHandler);
  router.patch('/:id', patchConditionHandler);
  router.delete('/:id', deleteConditionHandler);
  return router;
};
