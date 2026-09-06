import { Router } from 'express';
import { commitTherapyExerciseImportHandler } from './routes/commit-therapy-exercise-import-handler';
import { previewTherapyExerciseImportHandler } from './routes/preview-therapy-exercise-import-handler';
import { therapyExerciseImportUpload } from './upload-middleware';

/**
 * Factory for therapy exercise imports router.
 */
export const createTherapyExerciseImportsRouter = (): Router => {
  const router = Router();
  router.post(
    '/preview',
    therapyExerciseImportUpload.single('file'),
    previewTherapyExerciseImportHandler,
  );
  router.post('/commit', commitTherapyExerciseImportHandler);
  return router;
};
