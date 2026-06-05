import type { SupabaseClient } from '@supabase/supabase-js';
import type { FocusArea, UpdateFocusAreaInput } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Updates a focus area by id.
 */
export const updateFocusAreaById = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdateFocusAreaInput,
): Promise<FocusArea> => {
  const patch: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error('name cannot be empty');
    patch.name = name;
  }

  if (input.description !== undefined) {
    patch.description = optionalText(input.description);
  }

  const { data, error } = await supabase
    .from('focus_areas')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.message.includes('idx_focus_areas_name_lower')) {
      throw new Error('A focus area with this name already exists');
    }
    throw new Error(`Failed to update focus area: ${error.message}`);
  }

  return data as FocusArea;
};
