import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Deletes a focus area by id.
 */
export const deleteFocusAreaById = async (supabase: SupabaseClient, id: string): Promise<void> => {
  const { error } = await supabase.from('focus_areas').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete focus area: ${error.message}`);
  }
};
