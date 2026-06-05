import type { SupabaseClient } from '@supabase/supabase-js';
import { assertHospitalExists, assertSpecialtyExists } from './assert-relations-exist';
import type { Doctor, UpdateDoctorInput } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates a doctor by id.
 */
export const updateDoctorById = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdateDoctorInput,
): Promise<Doctor> => {
  const patch: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error('name cannot be empty');
    patch.name = name;
  }
  if (input.hospital_id !== undefined) {
    if (!input.hospital_id.trim()) throw new Error('hospital_id is required');
    await assertHospitalExists(supabase, input.hospital_id);
    patch.hospital_id = input.hospital_id;
  }
  if (input.specialty_id !== undefined) {
    if (!input.specialty_id.trim()) throw new Error('specialty_id is required');
    await assertSpecialtyExists(supabase, input.specialty_id);
    patch.specialty_id = input.specialty_id;
  }
  if (input.notes !== undefined) patch.notes = optionalText(input.notes);

  const { data, error } = await supabase
    .from('doctors')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update doctor: ${error.message}`);
  }

  return data as Doctor;
};
