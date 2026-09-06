import type { Pool } from 'pg';
import type { CreateTherapyExerciseImportInput, TherapyExerciseImport } from './types';

/**
 * Creates a therapy exercise import preview record.
 */
export const createTherapyExerciseImport = async (
  pool: Pool,
  input: CreateTherapyExerciseImportInput,
): Promise<TherapyExerciseImport> => {
  console.log('💾 createTherapyExerciseImport');
  const result = await pool.query<TherapyExerciseImport>(
    `INSERT INTO therapy_exercise_imports (status, draft_json)
     VALUES ($1, $2::jsonb)
     RETURNING *`,
    [input.status, JSON.stringify(input.draft_json)],
  );
  return result.rows[0];
};
