import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local',
  );
}

// Cliente sin generic Database: TS infiere any en operaciones, pero los componentes
// usan los tipos explícitos del módulo types/database.ts cuando lo necesitan.
// Esto evita errores de "never" al hacer .update() / .insert() con shapes parciales.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';

export function isAdmin(email: string | null | undefined): boolean {
  if (!email || !ADMIN_EMAIL) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
