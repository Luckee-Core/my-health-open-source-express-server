import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Deletes a doctor by id.
 */
export const deleteDoctorById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase.from('doctors').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete doctor: ${error.message}`);
  }
};
