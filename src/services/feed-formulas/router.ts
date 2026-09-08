import { Router } from 'express';
import { deleteFeedFormulaHandler } from './routes/delete-feed-formula-handler';
import { getFeedFormulasHandler } from './routes/get-feed-formulas-handler';
import { patchFeedFormulaHandler } from './routes/patch-feed-formula-handler';
import { postFeedFormulaHandler } from './routes/post-feed-formula-handler';

/**
 * Factory for feed formulas router.
 */
export const createFeedFormulasRouter = (): Router => {
  const router = Router();
  router.get('/', getFeedFormulasHandler);
  router.post('/', postFeedFormulaHandler);
  router.patch('/:id', patchFeedFormulaHandler);
  router.delete('/:id', deleteFeedFormulaHandler);
  return router;
};
