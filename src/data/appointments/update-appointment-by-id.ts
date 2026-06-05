import type { SupabaseClient } from '@supabase/supabase-js';
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
  supabase: SupabaseClient,
  id: string,
  input: UpdateAppointmentInput,
): Promise<Appointment> => {
  const { data: existing, error: loadError } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();

  if (loadError || !existing) {
    throw new Error('appointment not found');
  }

  const patch: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  };

  if (input.doctor_id !== undefined) {
    if (!input.doctor_id.trim()) throw new Error('doctor_id is required');
    await assertDoctorExists(supabase, input.doctor_id);
    patch.doctor_id = input.doctor_id;
  }
  if (input.scheduled_at !== undefined) {
    if (!input.scheduled_at.trim()) throw new Error('scheduled_at is required');
    const scheduledAt = new Date(input.scheduled_at);
    if (Number.isNaN(scheduledAt.getTime())) throw new Error('Invalid scheduled_at');
    patch.scheduled_at = scheduledAt.toISOString();
  }
  if (input.appointment_type !== undefined) {
    patch.appointment_type = optionalText(input.appointment_type);
  }
  if (input.reason !== undefined) patch.reason = optionalText(input.reason);
  if (input.notes !== undefined) patch.notes = optionalText(input.notes);

  let nextStatus = existing.status as AppointmentStatus;
  if (input.status !== undefined) {
    if (!isAppointmentStatus(input.status)) {
      throw new Error('status must be scheduled, completed, or cancelled');
    }
    nextStatus = input.status;
    patch.status = input.status;
  }

  if (input.status !== undefined || input.completed_at !== undefined) {
    patch.completed_at = resolveCompletedAt(
      nextStatus,
      input.completed_at !== undefined ? input.completed_at : existing.completed_at,
    );
  }

  const { data, error } = await supabase
    .from('appointments')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update appointment: ${error.message}`);
  }

  return data as Appointment;
};
