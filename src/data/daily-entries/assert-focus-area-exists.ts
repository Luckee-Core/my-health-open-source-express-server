import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Validates that a focus area id exists.
 */
export const assertFocusAreaExists = async (
  supabase: SupabaseClient,
  focusAreaId: string,
): Promise<void> => {
  const { data, error } = await supabase
    .from('focus_areas')
    .select('id')
    .eq('id', focusAreaId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to validate focus area: ${error.message}`);
  }
  if (!data) {
    throw new Error('focus area not found');
  }
};
