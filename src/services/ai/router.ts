import { Router } from 'express';
import {
  getExtractSessionHandler,
  postCommitExtractSessionHandler,
  postExtractConditionsHandler,
  postExtractMedicationsHandler,
} from './routes/extract-handlers';

/**
 * Factory for AI extract routes.
 */
export const createAiRouter = (): Router => {
  const router = Router();
  router.post('/extract/medications', postExtractMedicationsHandler);
  router.post('/extract/conditions', postExtractConditionsHandler);
  router.get('/extract-sessions/:id', getExtractSessionHandler);
  router.post('/extract-sessions/:id/commit', postCommitExtractSessionHandler);
  return router;
};
