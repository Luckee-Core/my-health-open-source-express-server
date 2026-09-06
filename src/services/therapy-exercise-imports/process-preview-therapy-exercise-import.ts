import type { Pool } from 'pg';
import { createTherapyExerciseImport } from '../../data/therapy-exercise-imports';
import type { TherapyExerciseImportDraftExercise } from '../../data/therapy-exercise-imports';
import { extractTherapyExercisesFromImage } from './extract-therapy-exercises-from-image';

export type PreviewTherapyExerciseImportInput = {
  buffer: Buffer;
  mimeType: string;
};

export type PreviewTherapyExerciseImportResult = {
  previewId: string;
  exercises: TherapyExerciseImportDraftExercise[];
};

/**
 * Extracts therapy exercises from a photo and persists a preview draft.
 */
export const processPreviewTherapyExerciseImport = async (
  pool: Pool,
  input: PreviewTherapyExerciseImportInput,
): Promise<PreviewTherapyExerciseImportResult> => {
  console.log('🚀 processPreviewTherapyExerciseImport');
  const draft = await extractTherapyExercisesFromImage(input.buffer, input.mimeType);

  const created = await createTherapyExerciseImport(pool, {
    status: 'previewed',
    draft_json: draft,
  });

  console.log(`✅ processPreviewTherapyExerciseImport: ${created.id}`);
  return {
    previewId: created.id,
    exercises: draft.exercises,
  };
};
