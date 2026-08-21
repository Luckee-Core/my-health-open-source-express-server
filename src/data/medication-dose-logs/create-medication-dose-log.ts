import type { Pool } from 'pg';
import type { CreateMedicationDoseLogInput, MedicationDoseLog } from './types';

/**
 * Records that a medication dose was taken.
 */
export const createMedicationDoseLog = async (
  pool: Pool,
  medicationId: string,
  input: CreateMedicationDoseLogInput = {},
): Promise<MedicationDoseLog> => {
  console.log('💾 createMedicationDoseLog');
  const result = await pool.query<MedicationDoseLog>(
    `INSERT INTO medication_dose_logs (medication_id, taken_at, notes)
     VALUES ($1, COALESCE($2::timestamptz, now()), $3)
     RETURNING *`,
    [medicationId, input.taken_at ?? null, input.notes ?? null],
  );
  return result.rows[0];
};

/**
 * Returns the most recent dose log for a medication.
 */
export const getLatestMedicationDoseLog = async (
  pool: Pool,
  medicationId: string,
): Promise<MedicationDoseLog | null> => {
  const result = await pool.query<MedicationDoseLog>(
    `SELECT * FROM medication_dose_logs
     WHERE medication_id = $1
     ORDER BY taken_at DESC
     LIMIT 1`,
    [medicationId],
  );
  return result.rows[0] ?? null;
};
