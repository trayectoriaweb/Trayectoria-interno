import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string | null;
  anonKey: string | null;
  isConnected: boolean;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('TU_PROYECTO') &&
    !supabaseUrl.includes('your-project')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: supabaseUrl || null,
    anonKey: supabaseAnonKey || null,
    isConnected: isSupabaseConfigured,
  };
}

export const SUPABASE_SETUP_GUIDE = {
  requiredEnvVars: [
    { key: 'VITE_SUPABASE_URL', description: 'URL del proyecto Supabase (ej. https://xyz.supabase.co)' },
    { key: 'VITE_SUPABASE_ANON_KEY', description: 'Public Anon API Key de Supabase' },
  ],
  tables: [
    'clients',
    'projects',
    'webs',
    'domains',
    'tasks',
    'activity_logs',
    'internal_notes',
  ],
  schemaPath: 'supabase/schema.sql',
};
