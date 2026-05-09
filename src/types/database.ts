// Tipos del esquema Supabase. Mantener en sync con /supabase/schema.sql
// y migracion-propuestas.sql.

export type NivelMiembro = 'nucleo' | 'colaborador' | 'antiguo';
export type TipoMiembro = 'actor' | 'direccion' | 'tecnico' | 'otros';
export type EstadoObra = 'en_cartel' | 'archivada' | 'planificada';
export type EstadoPropuesta = 'pendiente' | 'aprobada' | 'rechazada';

export interface Profile {
  id: string;
  user_id: string | null;
  nombre: string;
  slug: string;
  tipo: TipoMiembro;
  nivel: NivelMiembro;
  bio: string | null;
  foto_url: string | null;
  ciudad: string | null;
  email_contacto: string | null;
  instagram: string | null;
  youtube: string | null;
  facebook: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Obra {
  id: string;
  titulo: string;
  slug: string;
  autor: string | null;
  sinopsis: string | null;
  anio_estreno: number | null;
  duracion_minutos: number | null;
  ficha_tecnica: string | null;
  foto_portada_url: string | null;
  estado: EstadoObra;
  director_id: string | null;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface Produccion {
  id: string;
  obra_id: string;
  temporada: string;
  anio: number;
  director_id: string | null;
  notas: string | null;
  foto_portada_url: string | null;
  estado: EstadoObra;
  created_at: string;
}

export interface Reparto {
  id: string;
  produccion_id: string;
  profile_id: string;
  personaje: string;
  orden: number;
}

export interface ObraFoto {
  id: string;
  obra_id: string;
  url: string;
  pie: string | null;
  orden: number;
  es_portada: boolean;
}

export interface ObraVideo {
  id: string;
  obra_id: string;
  youtube_id: string;
  titulo: string | null;
  orden: number;
}

export interface ProfileFoto {
  id: string;
  profile_id: string;
  url: string;
  orden: number;
}

// ─── PROPUESTAS DE REPARTO ───────────────────────────────────────────────
export interface RepartoPropuesta {
  id: string;
  profile_id: string;
  // Camino A: producción existente
  produccion_id: string | null;
  // Camino B: obra existente, temporada nueva
  obra_id: string | null;
  temporada_propuesta: string | null;
  anio_propuesto: number | null;
  // Estado
  estado: EstadoPropuesta;
  nota_actor: string | null;
  nota_admin: string | null;
  resuelta_at: string | null;
  resuelta_por: string | null;
  created_at: string;
}

export interface RepartoPropuestaPersonaje {
  id: string;
  propuesta_id: string;
  personaje: string;
  orden: number;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      obras: { Row: Obra; Insert: Partial<Obra>; Update: Partial<Obra> };
      producciones: { Row: Produccion; Insert: Partial<Produccion>; Update: Partial<Produccion> };
      reparto: { Row: Reparto; Insert: Partial<Reparto>; Update: Partial<Reparto> };
      obra_fotos: { Row: ObraFoto; Insert: Partial<ObraFoto>; Update: Partial<ObraFoto> };
      obra_videos: { Row: ObraVideo; Insert: Partial<ObraVideo>; Update: Partial<ObraVideo> };
      profile_fotos: { Row: ProfileFoto; Insert: Partial<ProfileFoto>; Update: Partial<ProfileFoto> };
      reparto_propuestas: { Row: RepartoPropuesta; Insert: Partial<RepartoPropuesta>; Update: Partial<RepartoPropuesta> };
      reparto_propuestas_personajes: { Row: RepartoPropuestaPersonaje; Insert: Partial<RepartoPropuestaPersonaje>; Update: Partial<RepartoPropuestaPersonaje> };
    };
  };
}
