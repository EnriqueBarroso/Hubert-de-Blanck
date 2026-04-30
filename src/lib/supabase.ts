import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local',
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string) || '';

export function isAdmin(email: string | null | undefined): boolean {
  if (!email || !ADMIN_EMAIL) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
