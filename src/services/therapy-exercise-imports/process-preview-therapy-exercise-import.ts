import type { Pool } from 'pg';
import { updateTherapyExerciseImportAiExchange } from '../../data/therapy-exercise-import-ai-exchanges';
import type { TherapyExerciseImportAiExchange } from '../../model/therapy-exercise-import-ai-exchange';
import { updateTherapyExerciseImportAiRequest } from '../../data/therapy-exercise-import-ai-requests';
import {
  createTherapyExerciseImport,
  updateTherapyExerciseImportById,
} from '../../data/therapy-exercise-imports';
import type { TherapyExerciseImportDraftExercise } from '../../model/therapy-exercise-import';
import { processExtractTherapyExercisesFromImage } from './process-extract-therapy-exercises-from-image';

export type PreviewTherapyExerciseImportInput = {
  buffer: Buffer;
  mimeType: string;
  filename?: string;
};

export type PreviewTherapyExerciseImportResult = {
  previewId: string;
  exercises: TherapyExerciseImportDraftExercise[];
  exchangeId: string;
  exchange: TherapyExerciseImportAiExchange;
};

/**
 * Extracts therapy exercises from a photo, persists AI audit rows, and stores a preview draft.
 */
export const processPreviewTherapyExerciseImport = async (
  pool: Pool,
  input: PreviewTherapyExerciseImportInput,
): Promise<PreviewTherapyExerciseImportResult> => {
  console.log('🚀 processPreviewTherapyExerciseImport');
  const extracted = await processExtractTherapyExercisesFromImage(pool, input);

  const created = await createTherapyExerciseImport(pool, {
    status: 'previewed',
    draft_json: extracted.draft,
  });

  await updateTherapyExerciseImportById(pool, created.id, {
    exchange_id: extracted.exchange.id,
  });

  await updateTherapyExerciseImportAiExchange(pool, extracted.exchange.id, {
    import_id: created.id,
  });

  await updateTherapyExerciseImportAiRequest(pool, extracted.requestId, {
    import_id: created.id,
  });

  console.log(`✅ processPreviewTherapyExerciseImport: ${created.id}`);
  return {
    previewId: created.id,
    exercises: extracted.draft.exercises,
    exchangeId: extracted.exchange.id,
    exchange: { ...extracted.exchange, import_id: created.id },
  };
};
