import type { PoolClient } from 'pg';
import type { TherapyExerciseImport } from './types';

/**
 * Marks a therapy exercise import as committed.
 */
export const markTherapyExerciseImportCommitted = async (
  client: PoolClient,
  id: string,
): Promise<TherapyExerciseImport | null> => {
  const result = await client.query<TherapyExerciseImport>(
    `UPDATE therapy_exercise_imports
     SET status = 'committed', draft_json = '{}'::jsonb, updated_at = now()
     WHERE id = $1 AND status = 'previewed'
     RETURNING *`,
    [id],
  );
  return result.rows[0] ?? null;
};
