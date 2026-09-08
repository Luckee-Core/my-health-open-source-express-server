import type { Pool } from 'pg';
import type { TherapyExerciseImport } from '../../model/therapy-exercise-import';

/**
 * Updates a therapy exercise import row.
 */
export const updateTherapyExerciseImportById = async (
  pool: Pool,
  id: string,
  input: { exchange_id?: string | null },
): Promise<TherapyExerciseImport | null> => {
  if (input.exchange_id === undefined) {
    const existing = await pool.query<TherapyExerciseImport>(
      'SELECT * FROM therapy_exercise_imports WHERE id = $1',
      [id],
    );
    return existing.rows[0] ?? null;
  }

  const result = await pool.query<TherapyExerciseImport>(
    `UPDATE therapy_exercise_imports
     SET exchange_id = $1, updated_at = now()
     WHERE id = $2
     RETURNING *`,
    [input.exchange_id, id],
  );
  return result.rows[0] ?? null;
};
