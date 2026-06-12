import type { Pool } from 'pg';
import { assertDoctorExists } from './assert-doctor-exists';
import { isAppointmentStatus, resolveCompletedAt } from './resolve-completed-at';
import type { Appointment, AppointmentStatus, UpdateAppointmentInput } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates an appointment by id.
 */
export const updateAppointmentById = async (
  pool: Pool,
  id: string,
  input: UpdateAppointmentInput,
): Promise<Appointment> => {
  let existing: Appointment;
  try {
    const loadResult = await pool.query<Appointment>(
      'SELECT * FROM appointments WHERE id = $1',
      [id],
    );
    if (loadResult.rowCount === 0) {
      throw new Error('appointment not found');
    }
    existing = loadResult.rows[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'appointment not found') {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load appointment: ${message}`);
  }

  const sets: string[] = ['updated_at = now()'];
  const values: (string | null)[] = [];
  let param = 1;

  if (input.doctor_id !== undefined) {
    if (!input.doctor_id.trim()) throw new Error('doctor_id is required');
    await assertDoctorExists(pool, input.doctor_id);
    sets.push(`doctor_id = $${param++}`);
    values.push(input.doctor_id);
  }
  if (input.scheduled_at !== undefined) {
    if (!input.scheduled_at.trim()) throw new Error('scheduled_at is required');
    const scheduledAt = new Date(input.scheduled_at);
    if (Number.isNaN(scheduledAt.getTime())) throw new Error('Invalid scheduled_at');
    sets.push(`scheduled_at = $${param++}`);
    values.push(scheduledAt.toISOString());
  }
  if (input.appointment_type !== undefined) {
    sets.push(`appointment_type = $${param++}`);
    values.push(optionalText(input.appointment_type));
  }
  if (input.reason !== undefined) {
    sets.push(`reason = $${param++}`);
    values.push(optionalText(input.reason));
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${param++}`);
    values.push(optionalText(input.notes));
  }

  let nextStatus = existing.status as AppointmentStatus;
  if (input.status !== undefined) {
    if (!isAppointmentStatus(input.status)) {
      throw new Error('status must be scheduled, completed, or cancelled');
    }
    nextStatus = input.status;
    sets.push(`status = $${param++}`);
    values.push(input.status);
  }

  if (input.status !== undefined || input.completed_at !== undefined) {
    sets.push(`completed_at = $${param++}`);
    values.push(
      resolveCompletedAt(
        nextStatus,
        input.completed_at !== undefined ? input.completed_at : existing.completed_at,
      ),
    );
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
