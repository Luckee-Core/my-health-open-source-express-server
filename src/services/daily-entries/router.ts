import { Router } from 'express';
import { deleteDailyEntryHandler } from './routes/delete-daily-entry-handler';
import { getDailyEntriesHandler } from './routes/get-daily-entries-handler';
import { patchDailyEntryHandler } from './routes/patch-daily-entry-handler';
import { postDailyEntryHandler } from './routes/post-daily-entry-handler';

/**
 * Factory for daily entries router.
 */
export const createDailyEntriesRouter = (): Router => {
  const router = Router();
  router.get('/', getDailyEntriesHandler);
  router.post('/', postDailyEntryHandler);
  router.patch('/:id', patchDailyEntryHandler);
  router.delete('/:id', deleteDailyEntryHandler);
  return router;
};
