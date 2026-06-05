import type { Response } from 'express';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getManagedSupabaseClient } from '../../services/managed';
import { sendServerError } from './responses';

/**
 * Returns the managed Supabase client or sends 500 when unavailable.
 */
export const requireSupabase = (res: Response): SupabaseClient | null => {
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    console.error('❌ Supabase client unavailable');
    sendServerError(res, 'Service unavailable');
    return null;
  }
  return supabase;
};
