import { Router } from 'express';
import { deleteClinicalNoteHandler } from './routes/delete-clinical-note-handler';
import { getClinicalNotesHandler } from './routes/get-clinical-notes-handler';
import { patchClinicalNoteHandler } from './routes/patch-clinical-note-handler';
import { postClinicalNoteHandler } from './routes/post-clinical-note-handler';

/**
 * Factory for clinical-notes router.
 */
export const createClinicalNotesRouter = (): Router => {
  const router = Router();
  router.get('/', getClinicalNotesHandler);
  router.post('/', postClinicalNoteHandler);
  router.patch('/:id', patchClinicalNoteHandler);
  router.delete('/:id', deleteClinicalNoteHandler);
  return router;
};
