import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateHospitalInput, Hospital } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates a hospital / medical facility record.
 */
export const createHospital = async (
  supabase: SupabaseClient,
  input: CreateHospitalInput,
): Promise<Hospital> => {
  const name = input.name?.trim() ?? '';
  if (!name) {
    throw new Error('name is required');
  }

  const { data, error } = await supabase
    .from('hospitals')
    .insert({
      name,
      address: optionalText(input.address),
      email: optionalText(input.email),
      phone: optionalText(input.phone),
      notes: optionalText(input.notes),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create hospital: ${error.message}`);
  }

  return data as Hospital;
};
