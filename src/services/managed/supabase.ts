import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let managedClient: SupabaseClient | null = null;

/**
 * Returns the managed Supabase client, initializing lazily if needed.
 */
export const getManagedSupabaseClient = (): SupabaseClient | null => {
  if (managedClient) return managedClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('❌ Managed Supabase not configured');
    return null;
  }

  managedClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return managedClient;
};

/**
 * Initializes the managed Supabase client at server startup.
 */
export const initializeManagedSupabaseClient = (): void => {
  console.log('🚀 Initializing managed Supabase client');
  const client = getManagedSupabaseClient();
  if (client) {
    console.log('✅ Managed Supabase client ready');
  } else {
    console.error('❌ Managed Supabase client not configured');
  }
};
