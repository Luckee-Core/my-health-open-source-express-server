import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Deletes a daily entry by id.
 */
export const deleteDailyEntryById = async (supabase: SupabaseClient, id: string): Promise<void> => {
  const { error } = await supabase.from('daily_entries').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete daily entry: ${error.message}`);
  }
};
