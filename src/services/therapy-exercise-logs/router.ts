import { Router } from 'express';
import { getTherapyExerciseLogsHandler } from './routes/get-therapy-exercise-logs-handler';
import { postIncrementTherapyExerciseLogHandler } from './routes/post-increment-therapy-exercise-log-handler';

/**
 * Factory for therapy exercise logs router.
 */
export const createTherapyExerciseLogsRouter = (): Router => {
  const router = Router();
  router.get('/', getTherapyExerciseLogsHandler);
  router.post('/increment', postIncrementTherapyExerciseLogHandler);
  return router;
};
