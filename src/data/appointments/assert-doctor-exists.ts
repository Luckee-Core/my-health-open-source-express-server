import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Validates that a doctor id exists.
 */
export const assertDoctorExists = async (
  supabase: SupabaseClient,
  doctorId: string,
): Promise<void> => {
  const { data, error } = await supabase
    .from('doctors')
    .select('id')
    .eq('id', doctorId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to validate doctor: ${error.message}`);
  }
  if (!data) {
    throw new Error('doctor not found');
  }
};
