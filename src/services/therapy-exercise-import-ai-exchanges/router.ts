import { Router } from 'express';
import { getTherapyExerciseImportAiExchangesHandler } from './routes/get-therapy-exercise-import-ai-exchanges-handler';

/**
 * Factory for therapy exercise import AI exchanges router.
 */
export const createTherapyExerciseImportAiExchangesRouter = (): Router => {
  const router = Router();
  router.get('/', getTherapyExerciseImportAiExchangesHandler);
  return router;
};
