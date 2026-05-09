-- Migración: cartel propio por producción/temporada
-- Ejecutar en el editor SQL de Supabase (una sola vez)
ALTER TABLE public.producciones
  ADD COLUMN IF NOT EXISTS foto_portada_url TEXT;
