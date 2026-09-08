import { Router } from 'express';
import { getSpeechTherapyConsumptionHandler } from './routes/get-speech-therapy-consumption-handler';
import { postIncrementSpeechTherapyConsumptionHandler } from './routes/post-increment-speech-therapy-consumption-handler';

/**
 * Factory for speech therapy consumption router.
 */
export const createSpeechTherapyConsumptionRouter = (): Router => {
  const router = Router();
  router.get('/', getSpeechTherapyConsumptionHandler);
  router.post('/increment', postIncrementSpeechTherapyConsumptionHandler);
  return router;
};
