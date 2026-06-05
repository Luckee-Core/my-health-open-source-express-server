import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Deletes a hospital by id.
 */
export const deleteHospitalById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase.from('hospitals').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete hospital: ${error.message}`);
  }
};
