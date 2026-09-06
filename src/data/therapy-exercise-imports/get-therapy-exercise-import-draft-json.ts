import type { Pool, PoolClient } from 'pg';
import type { TherapyExerciseImportDraft } from './types';

type Db = Pool | PoolClient;

/**
 * Loads the draft JSON for a therapy exercise import.
 */
export const getTherapyExerciseImportDraftJson = async (
  db: Db,
  id: string,
): Promise<TherapyExerciseImportDraft | null> => {
  const result = await db.query<{ draft_json: TherapyExerciseImportDraft }>(
    `SELECT draft_json FROM therapy_exercise_imports WHERE id = $1`,
    [id],
  );
  return result.rows[0]?.draft_json ?? null;
};
