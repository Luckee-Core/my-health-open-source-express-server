import type { SupabaseClient } from '@supabase/supabase-js';
import type { Hospital } from './types';

/**
 * Loads all hospitals ordered by name.
 */
export const getAllHospitals = async (supabase: SupabaseClient): Promise<Hospital[]> => {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to load hospitals: ${error.message}`);
  }

  return (data ?? []) as Hospital[];
};
