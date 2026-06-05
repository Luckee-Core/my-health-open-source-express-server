import type { SupabaseClient } from '@supabase/supabase-js';
import type { Doctor } from './types';

/**
 * Loads all doctors ordered by name.
 */
export const getAllDoctors = async (supabase: SupabaseClient): Promise<Doctor[]> => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to load doctors: ${error.message}`);
  }

  return (data ?? []) as Doctor[];
};
