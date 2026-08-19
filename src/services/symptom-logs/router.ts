import { Router } from 'express';
import { deleteSymptomLogHandler } from './routes/delete-symptom-log-handler';
import { getSymptomLogsHandler } from './routes/get-symptom-logs-handler';
import { patchSymptomLogHandler } from './routes/patch-symptom-log-handler';
import { postBatchCheckInHandler } from './routes/post-batch-check-in-handler';
import { postSymptomLogHandler } from './routes/post-symptom-log-handler';

/**
 * Factory for symptom logs router.
 */
export const createSymptomLogsRouter = (): Router => {
  const router = Router();
  router.get('/', getSymptomLogsHandler);
  router.post('/batch-check-in', postBatchCheckInHandler);
  router.post('/', postSymptomLogHandler);
  router.patch('/:id', patchSymptomLogHandler);
  router.delete('/:id', deleteSymptomLogHandler);
  return router;
};
