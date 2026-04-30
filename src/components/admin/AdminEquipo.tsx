import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react';
import Modal from '../Modal';
import FormField from '../FormField';
import ImageUpload from '../ImageUpload';
import SectionRule from '../SectionRule';
import Tag from '../Tag';
import { supabase } from '../../lib/supabase';
import { slugify } from '../../lib/slug';
import { NIVEL_LABELS, TIPO_LABELS } from '../../lib/constants';
import type { Profile, NivelMiembro, TipoMiembro } from '../../types/database';

const PROFILE_VACIO: Partial<Profile> = {
  nombre: '',
  slug: '',
  tipo: 'actor',
  nivel: 'colaborador',
  bio: null,
  foto_url: null,
  ciudad: null,
  email_contacto: null,
  instagram: null,
  youtube: null,
  facebook: null,
  activo: true,
};

export default function AdminEquipo() {
  const [miembros, setMiembros] = useState<Profile[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<Partial<Profile> | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'pendientes' | 'publicados'>('todos');

  useEffect(() => {
    void cargar();
  }, []);

  async function cargar() {
    setCargando(true);
    // Recién llegados primero para que las fichas pendientes salten a la vista
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('activo', { ascending: true })   // pendientes primero (false < true)
      .order('created_at', { ascending: false });
    if (data) setMiembros(data);
    setCargando(false);
  }

  function abrirNuevo() {
    setEditando({ ...PROFILE_VACIO });
    setError(null);
  }

  function abrirEditar(m: Profile) {
    setEditando(m);
    setError(null);
  }

  async function guardar(e: FormEvent) {
    e.preventDefault();
    if (!editando || !editando.nombre) return;
    setGuardando(true);
    setError(null);

    const slugFinal = editando.slug?.trim() || slugify(editando.nombre);
    const datos = { ...editando, slug: slugFinal };

    let resultado;
    if (editando.id) {
      resultado = await supabase.from('profiles').update(datos).eq('id', editando.id);
    } else {
      resultado = await supabase.from('profiles').insert(datos);
    }

    if (resultado.error) {
      setError(resultado.error.message);
      setGuardando(false);
      return;
    }

    setEditando(null);
    setGuardando(false);
    await cargar();
  }

  async function toggleActivo(m: Profile) {
    await supabase.from('profiles').update({ activo: !m.activo }).eq('id', m.id);
    await cargar();
  }

  function actualizar<K extends keyof Profile>(campo: K, valor: Profile[K]) {
    setEditando((prev) => (prev ? { ...prev, [campo]: valor } : prev));
  }

  // Conteos por estado para mostrarlos en los chips de filtro
  const conteoPendientes = miembros.filter((m) => !m.activo).length;
  const conteoPublicados = miembros.filter((m) => m.activo).length;

  // Aplicar filtro al listado
  const miembrosFiltrados = miembros.filter((m) => {
    if (filtro === 'pendientes') return !m.activo;
    if (filtro === 'publicados') return m.activo;
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-baseline mb-4">
        <SectionRule>Miembros</SectionRule>
        <button
          onClick={abrirNuevo}
          className="bg-ink text-paper px-4 py-2 font-bold text-[11px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#B8253A] transition-all flex items-center gap-2"
        >
          <Plus size={14} /> Nuevo miembro
        </button>
      </div>

      {/* Chips de filtro */}
      <div className="flex flex-wrap gap-2 mb-5">
        <FiltroChip activo={filtro === 'todos'} onClick={() => setFiltro('todos')}>
          Todos · {miembros.length}
        </FiltroChip>
        <FiltroChip
          activo={filtro === 'pendientes'}
          onClick={() => setFiltro('pendientes')}
          destacado={conteoPendientes > 0}
        >
          Pendientes · {conteoPendientes}
        </FiltroChip>
        <FiltroChip activo={filtro === 'publicados'} onClick={() => setFiltro('publicados')}>
          Publicados · {conteoPublicados}
        </FiltroChip>
      </div>

      {cargando ? (
        <p className="text-ink/60 italic">Cargando…</p>
      ) : miembrosFiltrados.length === 0 ? (
        <p className="text-ink/60 italic">
          {filtro === 'pendientes'
            ? 'No hay fichas pendientes de revisión.'
            : filtro === 'publicados'
              ? 'No hay fichas publicadas todavía.'
              : 'No hay miembros aún. Crea el primero.'}
        </p>
      ) : (
        <div className="border-2 border-ink bg-paper-2">
          {/* Header — solo desktop */}
          <div className="hidden md:grid grid-cols-[80px_1.4fr_1fr_1fr_120px_60px] gap-3 px-4 py-3 bg-ink text-paper font-mono text-[10px] tracking-widest uppercase">
            <span></span>
            <span>Nombre</span>
            <span>Tipo</span>
            <span>Nivel</span>
            <span>Estado</span>
            <span></span>
          </div>

          {miembrosFiltrados.map((m) => (
            <div
              key={m.id}
              className="border-t border-ink/30 px-4 py-3 grid grid-cols-[60px_1fr_auto] md:grid-cols-[80px_1.4fr_1fr_1fr_120px_60px] gap-3 items-center"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-ink border border-ink overflow-hidden flex-shrink-0">
                {m.foto_url ? (
                  <img src={m.foto_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-paper/40 text-[9px]">SIN FOTO</div>
                )}
              </div>

              <div className="md:contents">
                <div>
                  <div className="font-serif font-bold text-ink leading-tight">{m.nombre}</div>
                  <div className="font-mono text-[10px] text-ink/50 md:hidden">
                    {TIPO_LABELS[m.tipo]} · {NIVEL_LABELS[m.nivel]}
                  </div>
                </div>
                <span className="hidden md:block text-sm text-ink/75">{TIPO_LABELS[m.tipo]}</span>
                <span className="hidden md:block">
                  <Tag variant={m.nivel === 'nucleo' ? 'carmin' : 'paper'}>{NIVEL_LABELS[m.nivel]}</Tag>
                </span>
                <span className="hidden md:block">
                  <Tag variant={m.activo ? 'paper' : 'ink'}>{m.activo ? 'Activo' : 'Oculto'}</Tag>
                </span>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => toggleActivo(m)}
                  aria-label={m.activo ? 'Ocultar' : 'Mostrar'}
                  title={m.activo ? 'Ocultar del público' : 'Mostrar al público'}
                  className="p-1.5 text-ink/60 hover:text-carmin"
                >
                  {m.activo ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => abrirEditar(m)}
                  aria-label="Editar"
                  className="p-1.5 text-ink hover:text-carmin"
                >
                  <Pencil size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear/editar */}
      {editando && (
        <Modal
          abierto={!!editando}
          onCerrar={() => setEditando(null)}
          titulo={editando.id ? 'Editar miembro' : 'Nuevo miembro'}
          maxAncho="md"
        >
          <form onSubmit={guardar} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <ImageUpload
                valor={editando.foto_url ?? null}
                onCambio={(url) => actualizar('foto_url', url)}
                carpeta="profiles"
                aspecto="retrato"
                label="Subir retrato"
              />

              <div className="flex-1 w-full space-y-3">
                <FormField label="Nombre" requerido>
                  <input
                    type="text"
                    value={editando.nombre ?? ''}
                    onChange={(e) => actualizar('nombre', e.target.value)}
                    onBlur={() => {
                      if (!editando.slug && editando.nombre) {
                        actualizar('slug', slugify(editando.nombre));
                      }
                    }}
                    className="input-brut"
                    required
                  />
                </FormField>

                <FormField label="Slug (URL)" helper="Se genera automáticamente del nombre.">
                  <input
                    type="text"
                    value={editando.slug ?? ''}
                    onChange={(e) => actualizar('slug', slugify(e.target.value))}
                    className="input-brut font-mono text-xs"
                  />
                </FormField>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <FormField label="Tipo" requerido>
                <select
                  value={editando.tipo ?? 'actor'}
                  onChange={(e) => actualizar('tipo', e.target.value as TipoMiembro)}
                  className="input-brut"
                >
                  {Object.entries(TIPO_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Nivel" requerido>
                <select
                  value={editando.nivel ?? 'colaborador'}
                  onChange={(e) => actualizar('nivel', e.target.value as NivelMiembro)}
                  className="input-brut"
                >
                  {Object.entries(NIVEL_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField label="Biografía" helper={`${(editando.bio ?? '').length} / 400 caracteres`}>
              <textarea
                value={editando.bio ?? ''}
                onChange={(e) => actualizar('bio', e.target.value.slice(0, 400) || null)}
                rows={3}
                className="input-brut font-serif italic"
              />
            </FormField>

            <div className="grid sm:grid-cols-2 gap-3">
              <FormField label="Ciudad">
                <input
                  type="text"
                  value={editando.ciudad ?? ''}
                  onChange={(e) => actualizar('ciudad', e.target.value || null)}
                  className="input-brut"
                />
              </FormField>
              <FormField label="Email contacto">
                <input
                  type="email"
                  value={editando.email_contacto ?? ''}
                  onChange={(e) => actualizar('email_contacto', e.target.value || null)}
                  className="input-brut"
                />
              </FormField>
              <FormField label="Instagram (URL)">
                <input
                  type="url"
                  value={editando.instagram ?? ''}
                  onChange={(e) => actualizar('instagram', e.target.value || null)}
                  className="input-brut"
                  placeholder="https://instagram.com/…"
                />
              </FormField>
              <FormField label="YouTube (URL)">
                <input
                  type="url"
                  value={editando.youtube ?? ''}
                  onChange={(e) => actualizar('youtube', e.target.value || null)}
                  className="input-brut"
                  placeholder="https://youtube.com/@…"
                />
              </FormField>
            </div>

            {error && (
              <div className="bg-carmin text-paper px-3 py-2 text-sm font-semibold">{error}</div>
            )}

            <div className="flex justify-between items-center pt-4 border-t-2 border-ink">
              <button
                type="button"
                onClick={() => setEditando(null)}
                className="text-ink/60 text-[11px] tracking-widest uppercase font-semibold hover:text-ink"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="bg-ink text-paper px-6 py-3 font-bold text-[12px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#B8253A] transition-all disabled:opacity-50"
              >
                {guardando ? 'Guardando…' : 'Guardar →'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Chip de filtro reutilizable ────────────────────────────────────────────
interface FiltroChipProps {
  activo: boolean;
  destacado?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FiltroChip({ activo, destacado, onClick, children }: FiltroChipProps) {
  const base = 'px-3 py-1.5 text-[11px] tracking-widest uppercase font-semibold border-[1.5px] border-ink transition-shadow';
  const estado = activo
    ? 'bg-ink text-paper shadow-brut-sm'
    : destacado
      ? 'bg-carmin text-paper hover:shadow-brut-sm'
      : 'bg-paper-2 text-ink hover:shadow-brut-sm';
  return (
    <button type="button" onClick={onClick} className={`${base} ${estado}`}>
      {children}
    </button>
  );
}
