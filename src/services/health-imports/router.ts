import { Router } from 'express';
import { commitHealthImportHandler } from '../health-import/routes/commit-health-import-handler';
import { previewHealthImportHandler } from '../health-import/routes/preview-health-import-handler';
import { healthImportUpload } from '../health-import/upload-middleware';
import { getHealthImportByIdHandler } from './routes/get-health-import-by-id-handler';
import { getHealthImportsHandler } from './routes/get-health-imports-handler';

/**
 * Factory for health-imports router (preview/commit before parameterized GET).
 */
export const createHealthImportsRouter = (): Router => {
  const router = Router();
  router.get('/', getHealthImportsHandler);
  router.post(
    '/preview',
    healthImportUpload.single('file'),
    previewHealthImportHandler,
  );
  router.post('/commit', commitHealthImportHandler);
  router.get('/:id', getHealthImportByIdHandler);
  return router;
};
