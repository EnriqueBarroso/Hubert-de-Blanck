-- ============================================================================
-- ESQUEMA SUPABASE — COMPAÑÍA HUBERT DE BLANCK
-- ============================================================================
-- Ejecutar este script entero en el editor SQL de Supabase tras crear el proyecto.
-- Tablas: profiles, obras, producciones, reparto, obra_fotos, obra_videos,
-- profile_fotos. Todas con RLS activado.
-- ============================================================================

-- Extensiones necesarias --------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Función auxiliar: actualizar updated_at automáticamente -----------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función auxiliar: ¿es admin? (lee email desde auth.users) ---------------
-- NOTA: cambia 'admin@hubertdeblanck.com' por el email real del admin.
-- Mejor aún: léelo desde una tabla `app_settings` si vais a tener varios admins.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ) = 'admin@hubertdeblanck.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 1. PROFILES — miembros de la compañía
-- ============================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('actor', 'direccion', 'tecnico', 'otros')) DEFAULT 'actor',
  nivel TEXT NOT NULL CHECK (nivel IN ('nucleo', 'colaborador', 'antiguo')) DEFAULT 'colaborador',
  bio TEXT,
  foto_url TEXT,
  ciudad TEXT,
  email_contacto TEXT,
  instagram TEXT,
  youtube TEXT,
  facebook TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_slug ON public.profiles(slug);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_nivel_activo ON public.profiles(nivel, activo);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 2. OBRAS — repertorio de la compañía
-- ============================================================================
CREATE TABLE public.obras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  autor TEXT,
  sinopsis TEXT,
  anio_estreno INTEGER,
  duracion_minutos INTEGER,
  ficha_tecnica TEXT,
  foto_portada_url TEXT,
  estado TEXT NOT NULL CHECK (estado IN ('en_cartel', 'archivada', 'planificada')) DEFAULT 'archivada',
  director_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_obras_slug ON public.obras(slug);
CREATE INDEX idx_obras_estado ON public.obras(estado);
CREATE INDEX idx_obras_anio ON public.obras(anio_estreno DESC);

CREATE TRIGGER obras_updated_at
  BEFORE UPDATE ON public.obras
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 3. PRODUCCIONES — un montaje específico de una obra (temporada concreta)
-- ============================================================================
CREATE TABLE public.producciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  temporada TEXT NOT NULL,
  anio INTEGER NOT NULL,
  director_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notas TEXT,
  foto_portada_url TEXT,
  estado TEXT NOT NULL CHECK (estado IN ('en_cartel', 'archivada', 'planificada')) DEFAULT 'archivada',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_producciones_obra ON public.producciones(obra_id);
CREATE INDEX idx_producciones_anio ON public.producciones(anio DESC);

-- ============================================================================
-- 4. REPARTO — actores asignados a producciones
-- ============================================================================
CREATE TABLE public.reparto (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produccion_id UUID NOT NULL REFERENCES public.producciones(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  personaje TEXT NOT NULL,
  orden INTEGER NOT NULL DEFAULT 0,
  UNIQUE(produccion_id, profile_id, personaje)
);

CREATE INDEX idx_reparto_produccion ON public.reparto(produccion_id);
CREATE INDEX idx_reparto_profile ON public.reparto(profile_id);

-- ============================================================================
-- 5. OBRA_FOTOS — galería de cada obra
-- ============================================================================
CREATE TABLE public.obra_fotos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  pie TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  es_portada BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_obra_fotos_obra ON public.obra_fotos(obra_id);

-- ============================================================================
-- 6. OBRA_VIDEOS — videos de YouTube embebidos
-- ============================================================================
CREATE TABLE public.obra_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  youtube_id TEXT NOT NULL,
  titulo TEXT,
  orden INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_obra_videos_obra ON public.obra_videos(obra_id);

-- ============================================================================
-- 7. PROFILE_FOTOS — galería personal del miembro
-- ============================================================================
CREATE TABLE public.profile_fotos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  orden INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_profile_fotos_profile ON public.profile_fotos(profile_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Activar RLS en todas las tablas
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obras          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producciones   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reparto        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_fotos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_videos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_fotos  ENABLE ROW LEVEL SECURITY;

-- ─── PROFILES ─────────────────────────────────────────────────────────────
-- Todos pueden leer perfiles activos
CREATE POLICY "lectura publica perfiles activos"
  ON public.profiles FOR SELECT
  USING (activo = TRUE);

-- El miembro puede actualizar su propia ficha (campos limitados se controlan en cliente o con triggers)
CREATE POLICY "miembro edita su ficha"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin: todo
CREATE POLICY "admin gestiona perfiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── OBRAS ────────────────────────────────────────────────────────────────
CREATE POLICY "lectura publica obras"
  ON public.obras FOR SELECT
  USING (TRUE);

CREATE POLICY "admin gestiona obras"
  ON public.obras FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── PRODUCCIONES ─────────────────────────────────────────────────────────
CREATE POLICY "lectura publica producciones"
  ON public.producciones FOR SELECT
  USING (TRUE);

CREATE POLICY "admin gestiona producciones"
  ON public.producciones FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── REPARTO ──────────────────────────────────────────────────────────────
CREATE POLICY "lectura publica reparto"
  ON public.reparto FOR SELECT
  USING (TRUE);

CREATE POLICY "admin gestiona reparto"
  ON public.reparto FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── OBRA_FOTOS ───────────────────────────────────────────────────────────
CREATE POLICY "lectura publica obra fotos"
  ON public.obra_fotos FOR SELECT
  USING (TRUE);

CREATE POLICY "admin gestiona obra fotos"
  ON public.obra_fotos FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── OBRA_VIDEOS ──────────────────────────────────────────────────────────
CREATE POLICY "lectura publica obra videos"
  ON public.obra_videos FOR SELECT
  USING (TRUE);

CREATE POLICY "admin gestiona obra videos"
  ON public.obra_videos FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── PROFILE_FOTOS ────────────────────────────────────────────────────────
CREATE POLICY "lectura publica profile fotos"
  ON public.profile_fotos FOR SELECT
  USING (TRUE);

-- El miembro gestiona su propia galería personal
CREATE POLICY "miembro gestiona sus fotos"
  ON public.profile_fotos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = profile_fotos.profile_id AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = profile_fotos.profile_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "admin gestiona profile fotos"
  ON public.profile_fotos FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- STORAGE: bucket público para fotos
-- ============================================================================
-- Crear bucket "fotos" desde el panel de Supabase (Storage > New bucket > Public).
-- Una vez creado, ejecutar las siguientes políticas:
--
-- 1. Lectura pública de objetos:
--    CREATE POLICY "lectura publica fotos"
--    ON storage.objects FOR SELECT
--    USING (bucket_id = 'fotos');
--
-- 2. Subida solo para autenticados:
--    CREATE POLICY "subida fotos autenticados"
--    ON storage.objects FOR INSERT
--    TO authenticated
--    WITH CHECK (bucket_id = 'fotos');
--
-- 3. Borrado solo del propio usuario o admin:
--    CREATE POLICY "borrado fotos propietario o admin"
--    ON storage.objects FOR DELETE
--    TO authenticated
--    USING (bucket_id = 'fotos' AND (auth.uid() = owner OR public.is_admin()));
