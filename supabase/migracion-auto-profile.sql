-- ============================================================================
-- MIGRACIÓN — Auto-creación de profile al registrarse
-- ============================================================================
-- Ejecutar en el SQL Editor de Supabase.
--
-- Cuando un usuario se registra (email/password o Google OAuth), se crea
-- automáticamente una entrada en public.profiles con activo = false.
-- El miembro puede completarla; el admin la activa cuando esté lista.
--
-- ⚠️ ANTES DE EJECUTAR: cambia 'admin@hubertdeblanck.com' (línea con --[ADMIN])
-- por el email real del administrador, el mismo que tienes en .env.local.
-- ============================================================================

-- Extensión necesaria para quitar acentos al generar slugs
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ─── 1. Función que crea el profile cuando se registra un usuario ──────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  nombre_inicial TEXT;
  slug_base TEXT;
  slug_final TEXT;
  contador INT := 0;
BEGIN
  -- Si el usuario que se registra es el admin, no creamos ficha.
  -- El admin gestiona, no es miembro de la compañía.
  IF NEW.email = 'admin@hubertdeblanck.com' THEN  --[ADMIN]
    RETURN NEW;
  END IF;

  -- Nombre inicial: viene de Google (full_name), o se deriva del email.
  nombre_inicial := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    initcap(replace(split_part(NEW.email, '@', 1), '.', ' '))
  );

  -- Slug base: nombre sin acentos, en minúsculas, espacios → guiones.
  slug_base := lower(unaccent(nombre_inicial));
  slug_base := regexp_replace(slug_base, '[^a-z0-9\s-]', '', 'g');
  slug_base := regexp_replace(slug_base, '[\s_]+', '-', 'g');
  slug_base := trim(both '-' from slug_base);

  -- Si está vacío (caso muy edge: email solo con caracteres no-ASCII), usar el id.
  IF slug_base = '' OR slug_base IS NULL THEN
    slug_base := 'miembro-' || substring(NEW.id::text from 1 for 8);
  END IF;

  -- Si colisiona con otro slug existente, añadir sufijo numérico.
  slug_final := slug_base;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE slug = slug_final) LOOP
    contador := contador + 1;
    slug_final := slug_base || '-' || contador;
  END LOOP;

  -- Crear la ficha en estado pendiente
  INSERT INTO public.profiles (user_id, nombre, slug, tipo, nivel, activo)
  VALUES (
    NEW.id,
    nombre_inicial,
    slug_final,
    'actor',          -- tipo por defecto, el admin puede ajustarlo
    'colaborador',    -- nivel por defecto
    FALSE             -- pendiente de moderación → no visible al público
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 2. Trigger que dispara la función ──────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ─── 3. Políticas RLS adicionales ───────────────────────────────────────────

-- Permitir al miembro VER su propia ficha aunque esté inactiva.
-- (La política existente "lectura publica perfiles activos" solo deja ver los activos.)
CREATE POLICY "miembro lee su propia ficha"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Fallback: permitir al miembro CREAR su propia ficha si el trigger fallase.
-- (Defensa en profundidad — el frontend lo intentará crear si no existe.)
CREATE POLICY "miembro crea su propia ficha"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ─── 4. Verificación ────────────────────────────────────────────────────────
-- Tras ejecutar este script, registra un usuario de prueba (no admin) y comprueba:
--
--   SELECT user_id, nombre, slug, activo, created_at
--   FROM public.profiles
--   ORDER BY created_at DESC
--   LIMIT 5;
--
-- Debe aparecer la nueva ficha con activo = false.
-- ============================================================================
