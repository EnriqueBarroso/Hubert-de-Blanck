/**
 * Convierte un texto en un slug limpio para URLs.
 * Quita acentos, pasa a minúsculas, sustituye espacios y caracteres
 * no válidos por guiones, colapsa guiones repetidos.
 *
 * Ejemplos:
 *   "María Pérez"           → "maria-perez"
 *   "Bodas de sangre"       → "bodas-de-sangre"
 *   "El alma buena de Sezuán" → "el-alma-buena-de-sezuan"
 */
export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // solo letras, números, espacios y guiones
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
