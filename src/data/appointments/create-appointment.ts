import type { SupabaseClient } from '@supabase/supabase-js';
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
  supabase: SupabaseClient,
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

  await assertDoctorExists(supabase, input.doctor_id);

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      doctor_id: input.doctor_id,
      scheduled_at: scheduledAt.toISOString(),
      status,
      appointment_type: optionalText(input.appointment_type),
      reason: optionalText(input.reason),
      notes: optionalText(input.notes),
      completed_at: resolveCompletedAt(status, input.completed_at),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create appointment: ${error.message}`);
  }

  return data as Appointment;
};
