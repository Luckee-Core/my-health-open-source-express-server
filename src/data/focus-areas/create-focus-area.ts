import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateFocusAreaInput, FocusArea } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Creates a focus area record.
 */
export const createFocusArea = async (
  supabase: SupabaseClient,
  input: CreateFocusAreaInput,
): Promise<FocusArea> => {
  const name = input.name?.trim() ?? '';
  if (!name) {
    throw new Error('name is required');
  }

  const { data, error } = await supabase
    .from('focus_areas')
    .insert({
      name,
      description: optionalText(input.description),
    })
    .select()
    .single();

  if (error) {
    if (error.message.includes('idx_focus_areas_name_lower')) {
      throw new Error('A focus area with this name already exists');
    }
    throw new Error(`Failed to create focus area: ${error.message}`);
  }

  return data as FocusArea;
};
