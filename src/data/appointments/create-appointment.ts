import type { Pool } from 'pg';
import type { Appointment, CreateAppointmentInput } from './types';

/**
 * Creates an appointment record.
 */
export const createAppointment = async (
  pool: Pool,
  input: CreateAppointmentInput,
): Promise<Appointment> => {
  console.log('💾 createAppointment');
  try {
    const result = await pool.query<Appointment>(
      `INSERT INTO appointments (
         doctor_id, scheduled_at, status, appointment_type, reason, notes, completed_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        input.doctor_id,
        input.scheduled_at,
        input.status ?? 'scheduled',
        input.appointment_type ?? null,
        input.reason ?? null,
        input.notes ?? null,
        input.completed_at ?? null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create appointment: ${message}`);
  }
};
