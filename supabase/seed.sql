-- ============================================================================
-- DATOS DE EJEMPLO — para probar el sitio antes de meter contenido real
-- ============================================================================
-- Ejecutar después de schema.sql. Borra y reinserta datos demo.
-- IMPORTANTE: en producción reemplazar/borrar todo esto.
-- ============================================================================

-- Limpiar datos previos (cuidado en producción)
TRUNCATE public.reparto, public.producciones, public.obra_fotos, public.obra_videos,
         public.profile_fotos, public.obras, public.profiles RESTART IDENTITY CASCADE;

-- ─── MIEMBROS ──────────────────────────────────────────────────────────────
INSERT INTO public.profiles (id, nombre, slug, tipo, nivel, bio, ciudad) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ana Rivera', 'ana-rivera', 'direccion', 'nucleo',
   'Directora teatral habanera, fundadora de la compañía. Formada en el ISA.', 'La Habana'),
  ('22222222-2222-2222-2222-222222222222', 'María Pérez', 'maria-perez', 'actor', 'nucleo',
   'Actriz habanera, miembro fundadora desde 2018. Formada en el ISA, trabaja también en cine y dramaturgia.', 'La Habana'),
  ('33333333-3333-3333-3333-333333333333', 'Juan Méndez', 'juan-mendez', 'actor', 'nucleo',
   'Actor de teatro y cine. Especializado en personajes trágicos del repertorio clásico.', 'La Habana'),
  ('44444444-4444-4444-4444-444444444444', 'Carmen Ruiz', 'carmen-ruiz', 'actor', 'colaborador',
   'Actriz de larga trayectoria, colaboradora habitual de la compañía.', 'La Habana'),
  ('55555555-5555-5555-5555-555555555555', 'Pedro Castro', 'pedro-castro', 'actor', 'colaborador',
   'Actor formado en el ISA. Dedica su tiempo a teatro contemporáneo.', 'La Habana'),
  ('66666666-6666-6666-6666-666666666666', 'Pedro Gómez', 'pedro-gomez', 'direccion', 'antiguo',
   'Director invitado en varias temporadas. Actualmente dirige su propia compañía.', 'Madrid');

-- ─── OBRAS ─────────────────────────────────────────────────────────────────
INSERT INTO public.obras (id, titulo, slug, autor, sinopsis, anio_estreno, duracion_minutos, estado, director_id) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Bodas de sangre', 'bodas-de-sangre',
   'Federico García Lorca',
   'Una novia se fuga el día de su boda con su antiguo amor. La tragedia avanza inevitable hacia el final que todos conocen y nadie puede evitar.',
   2024, 90, 'en_cartel', '11111111-1111-1111-1111-111111111111'),
  ('a0000002-0000-0000-0000-000000000002', 'La casa de Bernarda Alba', 'la-casa-de-bernarda-alba',
   'Federico García Lorca',
   'Tras la muerte del padre, Bernarda impone un luto de ocho años a sus cinco hijas. La represión hierve en una casa cerrada al mundo.',
   2023, 105, 'archivada', '66666666-6666-6666-6666-666666666666'),
  ('a0000003-0000-0000-0000-000000000003', 'El alma buena de Sezuán', 'el-alma-buena-de-sezuan',
   'Bertolt Brecht',
   'Tres dioses descienden a la tierra para encontrar una persona buena. La única que les acoge es Shen Te, una prostituta de buen corazón.',
   2022, 130, 'archivada', '11111111-1111-1111-1111-111111111111');

-- ─── PRODUCCIONES ──────────────────────────────────────────────────────────
INSERT INTO public.producciones (id, obra_id, temporada, anio, director_id, estado) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001',
   'Temporada 2024', 2024, '11111111-1111-1111-1111-111111111111', 'en_cartel'),
  ('b0000002-0000-0000-0000-000000000002', 'a0000002-0000-0000-0000-000000000002',
   'Temporada 2023', 2023, '66666666-6666-6666-6666-666666666666', 'archivada'),
  ('b0000003-0000-0000-0000-000000000003', 'a0000003-0000-0000-0000-000000000003',
   'Temporada 2022', 2022, '11111111-1111-1111-1111-111111111111', 'archivada');

-- ─── REPARTO ───────────────────────────────────────────────────────────────
-- Bodas de sangre 2024
INSERT INTO public.reparto (produccion_id, profile_id, personaje, orden) VALUES
  ('b0000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Novia', 1),
  ('b0000001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Leonardo', 2),
  ('b0000001-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'Madre', 3),
  ('b0000001-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'Novio', 4);

-- Bernarda 2023
INSERT INTO public.reparto (produccion_id, profile_id, personaje, orden) VALUES
  ('b0000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Adela', 1),
  ('b0000002-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'Bernarda', 2);

-- El alma buena 2022
INSERT INTO public.reparto (produccion_id, profile_id, personaje, orden) VALUES
  ('b0000003-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Shen Te', 1),
  ('b0000003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'Yang Sun', 2);
