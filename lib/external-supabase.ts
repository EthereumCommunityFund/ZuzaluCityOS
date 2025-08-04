import { ExternalDatabase } from '@/types/external-database';
import { createClient } from '@supabase/supabase-js';

const externalSupabaseUrl = process.env.NEXT_PUBLIC_PENSIEVE_SUPABASE_URL;
const externalSupabaseAnonKey =
  process.env.NEXT_PUBLIC_PENSIEVE_SUPABASE_ANON_KEY;

if (!externalSupabaseUrl || !externalSupabaseAnonKey) {
  throw new Error('External Supabase environment variables are not set');
}

export const externalSupabase = createClient<ExternalDatabase>(
  externalSupabaseUrl,
  externalSupabaseAnonKey,
  {
    auth: {
      persistSession: false, // Since we're only reading data
    },
  },
);
