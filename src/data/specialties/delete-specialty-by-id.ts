import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Deletes a specialty by id.
 */
export const deleteSpecialtyById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase.from('specialties').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete specialty: ${error.message}`);
  }
};
