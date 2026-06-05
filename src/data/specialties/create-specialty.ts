import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateSpecialtyInput, Specialty } from './types';

/**
 * Creates a specialty record.
 */
export const createSpecialty = async (
  supabase: SupabaseClient,
  input: CreateSpecialtyInput,
): Promise<Specialty> => {
  const name = input.name?.trim() ?? '';
  if (!name) {
    throw new Error('name is required');
  }

  const { data, error } = await supabase
    .from('specialties')
    .insert({ name })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create specialty: ${error.message}`);
  }

  return data as Specialty;
};
