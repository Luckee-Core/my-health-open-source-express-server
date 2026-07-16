import { Router } from 'express';
import { deleteAllergyHandler } from './routes/delete-allergy-handler';
import { getAllergiesHandler } from './routes/get-allergies-handler';
import { patchAllergyHandler } from './routes/patch-allergy-handler';
import { postAllergyHandler } from './routes/post-allergy-handler';

/**
 * Factory for allergies router.
 */
export const createAllergiesRouter = (): Router => {
  const router = Router();
  router.get('/', getAllergiesHandler);
  router.post('/', postAllergyHandler);
  router.patch('/:id', patchAllergyHandler);
  router.delete('/:id', deleteAllergyHandler);
  return router;
};
