import type { Request, Response } from 'express';
import type { CommitTherapyExerciseImportInput } from '../process-commit-therapy-exercise-import';
import { processCommitTherapyExerciseImport } from '../process-commit-therapy-exercise-import';
import {
  requirePgPool,
  sendClientError,
  sendHandlerError,
  sendSuccess,
} from '../../../utils/http';

/**
 * Handles POST /api/data/therapy-exercise-imports/commit.
 */
export const commitTherapyExerciseImportHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 POST /api/data/therapy-exercise-imports/commit');
  const pool = requirePgPool(res);
  if (!pool) return;

  const body = req.body as CommitTherapyExerciseImportInput;
  if (!body?.previewId?.trim()) {
    sendClientError(res, 'previewId is required');
    return;
  }
  if (!Array.isArray(body.exercises) || body.exercises.length === 0) {
    sendClientError(res, 'exercises is required');
    return;
  }

  try {
    const result = await processCommitTherapyExerciseImport(pool, body);
    console.log('✅ POST /api/data/therapy-exercise-imports/commit');
    sendSuccess(res, result);
  } catch (error) {
    sendHandlerError(res, error, 'POST /api/data/therapy-exercise-imports/commit');
  }
};
