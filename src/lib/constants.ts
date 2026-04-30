import type { NivelMiembro, TipoMiembro, EstadoObra } from '../types/database';

export const NIVEL_LABELS: Record<NivelMiembro, string> = {
  nucleo: 'Núcleo',
  colaborador: 'Colaborador',
  antiguo: 'Antiguo',
};

export const TIPO_LABELS: Record<TipoMiembro, string> = {
  actor: 'Actor / Actriz',
  direccion: 'Dirección',
  tecnico: 'Equipo técnico',
  otros: 'Otros',
};

export const ESTADO_LABELS: Record<EstadoObra, string> = {
  en_cartel: 'En cartel',
  archivada: 'Archivada',
  planificada: 'Planificada',
};

export const COMPANIA = {
  nombre: 'Hubert de Blanck',
  ciudad: 'La Habana',
  pais: 'Cuba',
  descripcion_corta: 'Compañía teatral y sala con sede en La Habana.',
};
