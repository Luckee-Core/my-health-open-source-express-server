import type { SupabaseClient } from '@supabase/supabase-js';
import type { Appointment } from './types';

/**
 * Loads all appointments ordered by scheduled_at ascending.
 */
export const getAllAppointments = async (supabase: SupabaseClient): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('scheduled_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to load appointments: ${error.message}`);
  }

  return (data ?? []) as Appointment[];
};
