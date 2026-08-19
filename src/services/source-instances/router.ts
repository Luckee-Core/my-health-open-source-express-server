import { Router } from 'express';
import { getSourceSystemsHandler } from './routes/get-source-systems-handler';
import {
  getSourceInstancesHandler,
  postSourceInstanceHandler,
} from './routes/source-instance-handlers';

/**
 * Factory for source instance router.
 */
export const createSourceInstancesRouter = (): Router => {
  const router = Router();
  router.get('/', getSourceInstancesHandler);
  router.post('/', postSourceInstanceHandler);
  return router;
};

/**
 * Factory for source systems catalog router.
 */
export const createSourceSystemsRouter = (): Router => {
  const router = Router();
  router.get('/', getSourceSystemsHandler);
  return router;
};
