import type { Pool } from 'pg';
import { createAppointment } from '../../data/appointments/create-appointment';
import type { Appointment, CreateAppointmentInput } from '../../data/appointments/types';
import { assertDoctorExists, isAppointmentStatus, resolveCompletedAt } from '../../utils/appointments';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates an appointment after validating input and foreign keys.
 */
export const processCreateAppointment = async (
  pool: Pool,
  input: CreateAppointmentInput,
): Promise<Appointment> => {
  if (!input.doctor_id?.trim()) throw new Error('doctor_id is required');
  if (!input.scheduled_at?.trim()) throw new Error('scheduled_at is required');

  const scheduledAt = new Date(input.scheduled_at);
  if (Number.isNaN(scheduledAt.getTime())) throw new Error('Invalid scheduled_at');

  const status = input.status ?? 'scheduled';
  if (!isAppointmentStatus(status)) {
    throw new Error('status must be scheduled, completed, or cancelled');
  }

  await assertDoctorExists(pool, input.doctor_id);

  return createAppointment(pool, {
    doctor_id: input.doctor_id,
    scheduled_at: scheduledAt.toISOString(),
    status,
    appointment_type: optionalText(input.appointment_type),
    reason: optionalText(input.reason),
    notes: optionalText(input.notes),
    completed_at: resolveCompletedAt(status, input.completed_at),
  });
};
