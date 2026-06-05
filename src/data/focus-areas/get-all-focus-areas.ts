import type { SupabaseClient } from '@supabase/supabase-js';
import type { FocusArea } from './types';

/**
 * Loads all focus areas ordered by name ascending.
 */
export const getAllFocusAreas = async (supabase: SupabaseClient): Promise<FocusArea[]> => {
  const { data, error } = await supabase
    .from('focus_areas')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to load focus areas: ${error.message}`);
  }

  return (data ?? []) as FocusArea[];
};
