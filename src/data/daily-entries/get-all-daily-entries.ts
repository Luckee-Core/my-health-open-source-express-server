import type { SupabaseClient } from '@supabase/supabase-js';
import type { DailyEntry } from './types';

/**
 * Loads all daily entries ordered by entry_date descending.
 */
export const getAllDailyEntries = async (supabase: SupabaseClient): Promise<DailyEntry[]> => {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .order('entry_date', { ascending: false })
    .order('focus_area_id', { ascending: true });

  if (error) {
    throw new Error(`Failed to load daily entries: ${error.message}`);
  }

  return (data ?? []) as DailyEntry[];
};
