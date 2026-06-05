import type { SupabaseClient } from '@supabase/supabase-js';
import { assertFocusAreaExists } from './assert-focus-area-exists';
import type { DailyEntry, UpdateDailyEntryInput } from './types';

const optionalText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const parseEntryDate = (value: string): string => {
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new Error('Invalid entry_date');
  }
  const parsed = new Date(`${trimmed}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid entry_date');
  }
  return trimmed;
};

/**
 * Updates a daily entry by id.
 */
export const updateDailyEntryById = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdateDailyEntryInput,
): Promise<DailyEntry> => {
  const patch: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  };

  if (input.entry_date !== undefined) {
    if (!input.entry_date.trim()) {
      throw new Error('entry_date cannot be empty');
    }
    patch.entry_date = parseEntryDate(input.entry_date);
  }

  if (input.focus_area_id !== undefined) {
    if (!input.focus_area_id.trim()) {
      throw new Error('focus_area_id cannot be empty');
    }
    await assertFocusAreaExists(supabase, input.focus_area_id);
    patch.focus_area_id = input.focus_area_id;
  }

  if (input.notes !== undefined) {
    patch.notes = optionalText(input.notes);
  }

  const { data, error } = await supabase
    .from('daily_entries')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.message.includes('idx_daily_entries_date_focus_area')) {
      throw new Error('An entry already exists for this date and focus area');
    }
    throw new Error(`Failed to update daily entry: ${error.message}`);
  }

  return data as DailyEntry;
};
