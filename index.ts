import express from 'express';
import dotenv from 'dotenv';

import { setupEarlyMiddleware, setupErrorHandling } from './src/services/middleware';
import { initializeManagedPgPool } from './src/services/managed';
import { createHealthRouter } from './src/services/health';
import { createMyHealthDataService } from './src/services/my-health-data-service';
import { createApiDocsRouter } from './src/services/api-docs';
import { createAiRouter } from './src/services/ai';
import { startServer } from './src/services/server';

dotenv.config();

const DEFAULT_PORT = 3009;

const bootstrap = (): express.Application => {
  console.log('🚀 Starting my-health-express-server bootstrap');

  const portFromEnv = Number(process.env.PORT);
  const PORT =
    Number.isFinite(portFromEnv) && portFromEnv > 0 ? portFromEnv : DEFAULT_PORT;

  const app = express();

  setupEarlyMiddleware(app);
  initializeManagedPgPool();

  app.use('/', createHealthRouter());
  app.use('/api/health', createHealthRouter());

  app.use('/api/data', createMyHealthDataService());
  app.use('/api/ai', createAiRouter());
  app.use(createApiDocsRouter());
  console.log('✅ [bootstrap] API docs mounted at GET /api-docs.json');

  setupErrorHandling(app);

  startServer(app, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
  });

  return app;
};

let app: express.Application;

try {
  app = bootstrap();
} catch (err) {
  console.error('❌ [bootstrap] Failed to start server', err);
  process.exit(1);
}

export default app!;
