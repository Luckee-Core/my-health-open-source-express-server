import type { Pool } from 'pg';
import { createTherapyExercise } from '../../data/therapy-exercises';
import type { TherapyExercise } from '../../data/therapy-exercises';
import {
  getTherapyExerciseImportDraftJson,
  markTherapyExerciseImportCommitted,
} from '../../data/therapy-exercise-imports';
import type { TherapyExerciseImportDraftExercise } from '../../data/therapy-exercise-imports';
import { parseTrackingKind } from '../../utils/therapy-exercises';

export type CommitTherapyExerciseImportInput = {
  previewId: string;
  exercises: TherapyExerciseImportDraftExercise[];
};

export type CommitTherapyExerciseImportResult = {
  exercises: TherapyExercise[];
};

const validateExercise = (row: TherapyExerciseImportDraftExercise): void => {
  if (!row.name?.trim()) throw new Error('Each exercise must have a name');
  parseTrackingKind(row.tracking_kind);
  if (!Number.isFinite(row.target_count) || row.target_count < 1) {
    throw new Error('target_count must be at least 1');
  }
  if (!Number.isFinite(row.unit_size) || row.unit_size < 1) {
    throw new Error('unit_size must be at least 1');
  }
};

/**
 * Commits a previewed therapy exercise import into therapy_exercises rows.
 */
export const processCommitTherapyExerciseImport = async (
  pool: Pool,
  input: CommitTherapyExerciseImportInput,
): Promise<CommitTherapyExerciseImportResult> => {
  console.log(`🚀 processCommitTherapyExerciseImport: ${input.previewId}`);
  if (!input.previewId?.trim()) throw new Error('previewId is required');
  if (!Array.isArray(input.exercises) || input.exercises.length === 0) {
    throw new Error('exercises is required');
  }

  input.exercises.forEach(validateExercise);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const draft = await getTherapyExerciseImportDraftJson(client, input.previewId);
    if (!draft) {
      throw new Error('already committed or not found');
    }

    const marked = await markTherapyExerciseImportCommitted(client, input.previewId);
    if (!marked) {
      throw new Error('already committed or not found');
    }

    const created: TherapyExercise[] = [];
    for (let index = 0; index < input.exercises.length; index += 1) {
      const row = input.exercises[index];
      const exercise = await createTherapyExercise(client, {
        discipline: 'speech',
        name: row.name.trim(),
        instructions: row.instructions?.trim() ? row.instructions.trim() : null,
        tracking_kind: row.tracking_kind,
        target_count: row.target_count,
        unit_size: row.unit_size,
        source: 'photo_import',
        import_id: input.previewId,
        sort_order: index,
      });
      created.push(exercise);
    }

    await client.query('COMMIT');
    console.log(`✅ processCommitTherapyExerciseImport: ${created.length} exercises`);
    return { exercises: created };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
