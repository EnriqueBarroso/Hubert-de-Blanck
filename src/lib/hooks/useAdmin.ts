import { useEffect, useState } from 'react';
import { supabase, isAdmin } from '../supabase';
import type { User } from '@supabase/supabase-js';

interface UseAdminResult {
  user: User | null;
  esAdmin: boolean;
  cargando: boolean;
}

/**
 * Comprueba la sesión actual y si el email del usuario es el admin configurado.
 * El admin se valida en frontend (UX) y en RLS de Supabase (seguridad real).
 */
export function useAdmin(): UseAdminResult {
  const [user, setUser] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (activo) {
        setUser(user);
        setCargando(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (activo) setUser(session?.user ?? null);
    });

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    esAdmin: isAdmin(user?.email),
    cargando,
  };
}
