import type { Pool } from 'pg';
import { assertDoctorExists } from './assert-doctor-exists';
import { isAppointmentStatus, resolveCompletedAt } from './resolve-completed-at';
import type { Appointment, CreateAppointmentInput } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates an appointment record.
 */
export const createAppointment = async (
  pool: Pool,
  input: CreateAppointmentInput,
): Promise<Appointment> => {
  if (!input.doctor_id?.trim()) {
    throw new Error('doctor_id is required');
  }
  if (!input.scheduled_at?.trim()) {
    throw new Error('scheduled_at is required');
  }
  const scheduledAt = new Date(input.scheduled_at);
  if (Number.isNaN(scheduledAt.getTime())) {
    throw new Error('Invalid scheduled_at');
  }

  const status = input.status ?? 'scheduled';
  if (!isAppointmentStatus(status)) {
    throw new Error('status must be scheduled, completed, or cancelled');
  }

  await assertDoctorExists(pool, input.doctor_id);

  try {
    const result = await pool.query<Appointment>(
      `INSERT INTO appointments (
         doctor_id, scheduled_at, status, appointment_type, reason, notes, completed_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        input.doctor_id,
        scheduledAt.toISOString(),
        status,
        optionalText(input.appointment_type),
        optionalText(input.reason),
        optionalText(input.notes),
        resolveCompletedAt(status, input.completed_at),
      ],
    );
    return result.rows[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create appointment: ${message}`);
  }
};
