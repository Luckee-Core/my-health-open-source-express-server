import { Router } from 'express';
import { deleteTherapyExerciseHandler } from './routes/delete-therapy-exercise-handler';
import { getTherapyExercisesHandler } from './routes/get-therapy-exercises-handler';
import { patchTherapyExerciseHandler } from './routes/patch-therapy-exercise-handler';
import { postTherapyExerciseHandler } from './routes/post-therapy-exercise-handler';

/**
 * Factory for therapy exercises router.
 */
export const createTherapyExercisesRouter = (): Router => {
  const router = Router();
  router.get('/', getTherapyExercisesHandler);
  router.post('/', postTherapyExerciseHandler);
  router.patch('/:id', patchTherapyExerciseHandler);
  router.delete('/:id', deleteTherapyExerciseHandler);
  return router;
};
