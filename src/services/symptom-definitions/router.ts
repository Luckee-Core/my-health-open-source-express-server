import { Router } from 'express';
import { getSymptomDefinitionsHandler } from './routes/get-symptom-definitions-handler';

/**
 * Factory for symptom definitions router.
 */
export const createSymptomDefinitionsRouter = (): Router => {
  const router = Router();
  router.get('/', getSymptomDefinitionsHandler);
  return router;
};
