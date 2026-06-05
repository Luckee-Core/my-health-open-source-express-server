import type { SupabaseClient } from '@supabase/supabase-js';
import { assertHospitalExists, assertSpecialtyExists } from './assert-relations-exist';
import type { CreateDoctorInput, Doctor } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates a doctor record.
 */
export const createDoctor = async (
  supabase: SupabaseClient,
  input: CreateDoctorInput,
): Promise<Doctor> => {
  const name = input.name?.trim() ?? '';
  if (!name) {
    throw new Error('name is required');
  }
  if (!input.hospital_id?.trim()) {
    throw new Error('hospital_id is required');
  }
  if (!input.specialty_id?.trim()) {
    throw new Error('specialty_id is required');
  }

  await assertHospitalExists(supabase, input.hospital_id);
  await assertSpecialtyExists(supabase, input.specialty_id);

  const { data, error } = await supabase
    .from('doctors')
    .insert({
      name,
      hospital_id: input.hospital_id,
      specialty_id: input.specialty_id,
      notes: optionalText(input.notes),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create doctor: ${error.message}`);
  }

  return data as Doctor;
};
