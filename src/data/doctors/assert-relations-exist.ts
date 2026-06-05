import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Validates that a hospital id exists.
 */
export const assertHospitalExists = async (
  supabase: SupabaseClient,
  hospitalId: string,
): Promise<void> => {
  const { data, error } = await supabase
    .from('hospitals')
    .select('id')
    .eq('id', hospitalId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to validate hospital: ${error.message}`);
  }
  if (!data) {
    throw new Error('hospital not found');
  }
};

/**
 * Validates that a specialty id exists.
 */
export const assertSpecialtyExists = async (
  supabase: SupabaseClient,
  specialtyId: string,
): Promise<void> => {
  const { data, error } = await supabase
    .from('specialties')
    .select('id')
    .eq('id', specialtyId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to validate specialty: ${error.message}`);
  }
  if (!data) {
    throw new Error('specialty not found');
  }
};
