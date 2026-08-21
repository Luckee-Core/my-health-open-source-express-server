import type { Pool } from 'pg';
import type { CreateSymptomLogInput, SymptomLog } from './types';

/**
 * Creates a symptom log record.
 */
export const createSymptomLog = async (
  pool: Pool,
  input: CreateSymptomLogInput,
): Promise<SymptomLog> => {
  console.log('💾 createSymptomLog');
  try {
    const result = await pool.query<SymptomLog>(
      `INSERT INTO symptom_logs (
         recorded_at, name, severity, triggers, duration_minutes, notes,
         focus_area_id, symptom_definition_id, time_period
       )
       VALUES (COALESCE($1::timestamptz, now()), $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        input.recorded_at ?? null,
        input.name,
        input.severity ?? null,
        input.triggers ?? null,
        input.duration_minutes ?? null,
        input.notes ?? null,
        input.focus_area_id ?? null,
        input.symptom_definition_id ?? null,
        input.time_period ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create symptom log: ${message}`);
  }
};
