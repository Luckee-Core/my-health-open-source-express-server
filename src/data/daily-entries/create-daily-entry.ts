import type { SupabaseClient } from '@supabase/supabase-js';
import { assertFocusAreaExists } from './assert-focus-area-exists';
import type { CreateDailyEntryInput, DailyEntry } from './types';

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
 * Creates a daily entry record.
 */
export const createDailyEntry = async (
  supabase: SupabaseClient,
  input: CreateDailyEntryInput,
): Promise<DailyEntry> => {
  if (!input.focus_area_id?.trim()) {
    throw new Error('focus_area_id is required');
  }
  if (!input.entry_date?.trim()) {
    throw new Error('entry_date is required');
  }

  const entryDate = parseEntryDate(input.entry_date);
  await assertFocusAreaExists(supabase, input.focus_area_id);

  const { data, error } = await supabase
    .from('daily_entries')
    .insert({
      entry_date: entryDate,
      focus_area_id: input.focus_area_id,
      notes: optionalText(input.notes),
    })
    .select()
    .single();

  if (error) {
    if (error.message.includes('idx_daily_entries_date_focus_area')) {
      throw new Error('An entry already exists for this date and focus area');
    }
    throw new Error(`Failed to create daily entry: ${error.message}`);
  }

  return data as DailyEntry;
};
