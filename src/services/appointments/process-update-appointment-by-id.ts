import type { Pool } from 'pg';
import { getAppointmentById } from '../../data/appointments/get-appointment-by-id';
import { updateAppointmentById } from '../../data/appointments/update-appointment-by-id';
import type {
  Appointment,
  AppointmentStatus,
  UpdateAppointmentInput,
} from '../../data/appointments/types';
import { assertDoctorExists, isAppointmentStatus, resolveCompletedAt } from '../../utils/appointments';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates an appointment by id after validating input and foreign keys.
 */
export const processUpdateAppointmentById = async (
  pool: Pool,
  id: string,
  input: UpdateAppointmentInput,
): Promise<Appointment> => {
  const existing = await getAppointmentById(pool, id);
  if (!existing) throw new Error('appointment not found');

  const normalized: UpdateAppointmentInput = { ...input };

  if (input.doctor_id !== undefined) {
    if (!input.doctor_id.trim()) throw new Error('doctor_id is required');
    await assertDoctorExists(pool, input.doctor_id);
    normalized.doctor_id = input.doctor_id;
  }
  if (input.scheduled_at !== undefined) {
    if (!input.scheduled_at.trim()) throw new Error('scheduled_at is required');
    const scheduledAt = new Date(input.scheduled_at);
    if (Number.isNaN(scheduledAt.getTime())) throw new Error('Invalid scheduled_at');
    normalized.scheduled_at = scheduledAt.toISOString();
  }
  if (input.appointment_type !== undefined) {
    normalized.appointment_type = optionalText(input.appointment_type);
  }
  if (input.reason !== undefined) normalized.reason = optionalText(input.reason);
  if (input.notes !== undefined) normalized.notes = optionalText(input.notes);

  let nextStatus = existing.status as AppointmentStatus;
  if (input.status !== undefined) {
    if (!isAppointmentStatus(input.status)) {
      throw new Error('status must be scheduled, completed, or cancelled');
    }
    nextStatus = input.status;
    normalized.status = input.status;
  }

  if (input.status !== undefined || input.completed_at !== undefined) {
    normalized.completed_at = resolveCompletedAt(
      nextStatus,
      input.completed_at !== undefined ? input.completed_at : existing.completed_at,
    );
  }

  return updateAppointmentById(pool, id, normalized);
};
