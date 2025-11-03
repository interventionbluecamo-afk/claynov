/**
 * Supabase Client Setup
 * Initializes and exports Supabase client for authentication and database
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
  console.warn('Supabase not configured. Using localStorage auth as fallback.');
}

// Create Supabase client
export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id'))
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Check if Supabase is available
export function isSupabaseConfigured() {
  return supabase !== null;
}

