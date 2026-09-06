import type { Pool, PoolClient } from 'pg';
import type { CreateTherapyExerciseInput, TherapyExercise } from './types';

type Db = Pool | PoolClient;

/**
 * Creates a therapy exercise record.
 */
export const createTherapyExercise = async (
  db: Db,
  input: CreateTherapyExerciseInput,
): Promise<TherapyExercise> => {
  console.log('💾 createTherapyExercise');
  const result = await db.query<TherapyExercise>(
    `INSERT INTO therapy_exercises (
      discipline, name, instructions, tracking_kind, target_count, unit_size,
      frequency, is_active, sort_order, source, import_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      input.discipline ?? 'speech',
      input.name,
      input.instructions ?? null,
      input.tracking_kind,
      input.target_count,
      input.unit_size ?? 1,
      input.frequency ?? 'daily',
      input.is_active ?? true,
      input.sort_order ?? 0,
      input.source ?? 'manual',
      input.import_id ?? null,
    ],
  );
  return result.rows[0];
};
