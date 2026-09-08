import { Router } from 'express';
import { deleteFeedLogHandler } from './routes/delete-feed-log-handler';
import { getFeedLogsHandler } from './routes/get-feed-logs-handler';
import { putFeedLogHandler } from './routes/put-feed-log-handler';

/**
 * Factory for feed logs router.
 */
export const createFeedLogsRouter = (): Router => {
  const router = Router();
  router.get('/', getFeedLogsHandler);
  router.put('/', putFeedLogHandler);
  router.delete('/:id', deleteFeedLogHandler);
  return router;
};
