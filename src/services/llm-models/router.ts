import { Router } from 'express';
import { getLlmModelsHandler } from './routes/get-llm-models-handler';

/**
 * Factory for LLM models router.
 */
export const createLlmModelsRouter = (): Router => {
  const router = Router();
  router.get('/', getLlmModelsHandler);
  return router;
};
