import type { SupabaseClient } from '@supabase/supabase-js';
import type { Hospital, UpdateHospitalInput } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates a hospital by id.
 */
export const updateHospitalById = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdateHospitalInput,
): Promise<Hospital> => {
  const patch: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error('name cannot be empty');
    patch.name = name;
  }
  if (input.address !== undefined) patch.address = optionalText(input.address);
  if (input.email !== undefined) patch.email = optionalText(input.email);
  if (input.phone !== undefined) patch.phone = optionalText(input.phone);
  if (input.notes !== undefined) patch.notes = optionalText(input.notes);

  const { data, error } = await supabase
    .from('hospitals')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update hospital: ${error.message}`);
  }

  return data as Hospital;
};
