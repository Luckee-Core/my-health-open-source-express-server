import type { SupabaseClient } from '@supabase/supabase-js';
import type { Specialty } from './types';

/**
 * Loads all specialties ordered by name.
 */
export const getAllSpecialties = async (supabase: SupabaseClient): Promise<Specialty[]> => {
  const { data, error } = await supabase
    .from('specialties')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to load specialties: ${error.message}`);
  }

  return (data ?? []) as Specialty[];
};
