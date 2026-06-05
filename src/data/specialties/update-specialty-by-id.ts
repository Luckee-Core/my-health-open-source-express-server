import type { SupabaseClient } from '@supabase/supabase-js';
import type { Specialty, UpdateSpecialtyInput } from './types';

/**
 * Updates a specialty by id.
 */
export const updateSpecialtyById = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdateSpecialtyInput,
): Promise<Specialty> => {
  const patch: Record<string, string> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error('name cannot be empty');
    patch.name = name;
  }

  const { data, error } = await supabase
    .from('specialties')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update specialty: ${error.message}`);
  }

  return data as Specialty;
};
