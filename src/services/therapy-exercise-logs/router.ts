import { Router } from 'express';
import { getTherapyExerciseLogsHandler } from './routes/get-therapy-exercise-logs-handler';
import { postIncrementTherapyExerciseLogHandler } from './routes/post-increment-therapy-exercise-log-handler';
import { postDueTherapyExerciseLogHandler } from './routes/post-due-therapy-exercise-log-handler';
import { postSkipTherapyExerciseLogHandler } from './routes/post-skip-therapy-exercise-log-handler';

/**
 * Factory for therapy exercise logs router.
 */
export const createTherapyExerciseLogsRouter = (): Router => {
  const router = Router();
  router.get('/', getTherapyExerciseLogsHandler);
  router.post('/increment', postIncrementTherapyExerciseLogHandler);
  router.post('/skip', postSkipTherapyExerciseLogHandler);
  router.post('/due', postDueTherapyExerciseLogHandler);
  return router;
};
