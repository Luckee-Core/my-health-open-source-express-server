import type { Pool } from 'pg';
import type { MedicationDoseSchedule, UpsertMedicationDoseScheduleInput } from './types';

/**
 * Creates or updates the dose interval schedule for a medication.
 */
export const upsertMedicationDoseSchedule = async (
  pool: Pool,
  medicationId: string,
  input: UpsertMedicationDoseScheduleInput,
): Promise<MedicationDoseSchedule> => {
  const result = await pool.query<MedicationDoseSchedule>(
    `INSERT INTO medication_dose_schedules (medication_id, interval_minutes, reminder_enabled)
     VALUES ($1, $2, $3)
     ON CONFLICT (medication_id) DO UPDATE SET
       interval_minutes = EXCLUDED.interval_minutes,
       reminder_enabled = EXCLUDED.reminder_enabled,
       updated_at = now()
     RETURNING *`,
    [medicationId, input.interval_minutes, input.reminder_enabled ?? true],
  );
  return result.rows[0];
};

/**
 * Removes dose schedule (disables reminders).
 */
export const deleteMedicationDoseSchedule = async (
  pool: Pool,
  medicationId: string,
): Promise<void> => {
  await pool.query(`DELETE FROM medication_dose_schedules WHERE medication_id = $1`, [
    medicationId,
  ]);
};

/**
 * Loads dose schedule for one medication.
 */
export const getMedicationDoseSchedule = async (
  pool: Pool,
  medicationId: string,
): Promise<MedicationDoseSchedule | null> => {
  const result = await pool.query<MedicationDoseSchedule>(
    `SELECT * FROM medication_dose_schedules WHERE medication_id = $1`,
    [medicationId],
  );
  return result.rows[0] ?? null;
};
