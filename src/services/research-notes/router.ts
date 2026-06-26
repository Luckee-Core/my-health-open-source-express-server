import { Router } from 'express';
import { deleteResearchNoteHandler } from './routes/delete-research-note-handler';
import { getResearchNotesHandler } from './routes/get-research-notes-handler';
import { patchResearchNoteHandler } from './routes/patch-research-note-handler';
import { postResearchNoteHandler } from './routes/post-research-note-handler';

/**
 * Factory for research notes router.
 */
export const createResearchNotesRouter = (): Router => {
  const router = Router();
  router.get('/', getResearchNotesHandler);
  router.post('/', postResearchNoteHandler);
  router.patch('/:id', patchResearchNoteHandler);
  router.delete('/:id', deleteResearchNoteHandler);
  return router;
};
