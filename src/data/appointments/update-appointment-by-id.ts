import type { Pool } from 'pg';
import type { Appointment, UpdateAppointmentInput } from './types';

/**
 * Updates an appointment by id.
 */
export const updateAppointmentById = async (
  pool: Pool,
  id: string,
  input: UpdateAppointmentInput,
): Promise<Appointment> => {
  console.log('💾 updateAppointmentById');
  const sets: string[] = ['updated_at = now()'];
  const values: (string | null)[] = [];
  let param = 1;

  if (input.doctor_id !== undefined) {
    sets.push(`doctor_id = $${param++}`);
    values.push(input.doctor_id);
  }
  if (input.scheduled_at !== undefined) {
    sets.push(`scheduled_at = $${param++}`);
    values.push(input.scheduled_at);
  }
  if (input.appointment_type !== undefined) {
    sets.push(`appointment_type = $${param++}`);
    values.push(input.appointment_type);
  }
  if (input.reason !== undefined) {
    sets.push(`reason = $${param++}`);
    values.push(input.reason);
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${param++}`);
    values.push(input.notes);
  }
  if (input.status !== undefined) {
    sets.push(`status = $${param++}`);
    values.push(input.status);
  }
  if (input.completed_at !== undefined) {
    sets.push(`completed_at = $${param++}`);
    values.push(input.completed_at);
  }

  values.push(id);

  try {
    const result = await pool.query<Appointment>(
      `UPDATE appointments SET ${sets.join(', ')} WHERE id = $${param} RETURNING *`,
      values,
    );
    if (result.rowCount === 0) {
      throw new Error('appointment not found');
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'appointment not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update appointment: ${message}`);
  }
};
