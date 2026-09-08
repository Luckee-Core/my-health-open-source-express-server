import type { Pool } from 'pg';
import type { CreateMedicalHistoryEventInput, MedicalHistoryEvent } from '../../model/medical-history-event';

/**
 * Creates a medical history event record.
 */
export const createMedicalHistoryEvent = async (
  pool: Pool,
  input: CreateMedicalHistoryEventInput,
): Promise<MedicalHistoryEvent> => {
  console.log('💾 createMedicalHistoryEvent');
  try {
    const result = await pool.query<MedicalHistoryEvent>(
      `INSERT INTO medical_history_events (
         event_date, title, category, description,
         doctor_id, appointment_id, focus_area_id
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        input.event_date,
        input.title,
        input.category ?? 'other',
        input.description ?? null,
        input.doctor_id ?? null,
        input.appointment_id ?? null,
        input.focus_area_id ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create medical history event: ${message}`);
  }
};
