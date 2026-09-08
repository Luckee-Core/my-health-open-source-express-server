import type { Pool } from 'pg';
import type { MedicalHistoryEvent, UpdateMedicalHistoryEventInput } from '../../model/medical-history-event';

/**
 * Updates a medical history event by id.
 */
export const updateMedicalHistoryEventById = async (
  pool: Pool,
  id: string,
  input: UpdateMedicalHistoryEventInput,
): Promise<MedicalHistoryEvent> => {
  console.log('💾 updateMedicalHistoryEventById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | number | null)[] = [];
  let param = 1;

  if (input.event_date !== undefined) {
    sets.push(`event_date = $${param++}`);
    values.push(input.event_date);
  }
  if (input.title !== undefined) {
    sets.push(`title = $${param++}`);
    values.push(input.title);
  }
  if (input.category !== undefined) {
    sets.push(`category = $${param++}`);
    values.push(input.category);
  }
  if (input.description !== undefined) {
    sets.push(`description = $${param++}`);
    values.push(input.description);
  }
  if (input.doctor_id !== undefined) {
    sets.push(`doctor_id = $${param++}`);
    values.push(input.doctor_id);
  }
  if (input.appointment_id !== undefined) {
    sets.push(`appointment_id = $${param++}`);
    values.push(input.appointment_id);
  }
  if (input.focus_area_id !== undefined) {
    sets.push(`focus_area_id = $${param++}`);
    values.push(input.focus_area_id);
  }

  values.push(id);

  try {
    const result = await pool.query<MedicalHistoryEvent>(
      `UPDATE medical_history_events SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('medical history event not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'medical history event not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update medical history event: ${message}`);
  }
};
