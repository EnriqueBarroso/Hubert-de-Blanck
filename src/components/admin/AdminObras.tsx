import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, ChevronRight, Users, Trash2, Briefcase } from 'lucide-react';
import Modal from '../Modal';
import FormField from '../FormField';
import ImageUpload from '../ImageUpload';
import SectionRule from '../SectionRule';
import Tag from '../Tag';
import { supabase } from '../../lib/supabase';
import { slugify } from '../../lib/slug';
import { ESTADO_LABELS } from '../../lib/constants';
import type { Obra, Produccion, Profile, EstadoObra, Reparto } from '../../types/database';

interface ObraExpandida extends Obra {
  producciones: Produccion[];
}

const OBRA_VACIA: Partial<Obra> = {
  titulo: '',
  slug: '',
  autor: null,
  sinopsis: null,
  anio_estreno: null,
  duracion_minutos: null,
  estado: 'archivada',
  director_id: null,
  foto_portada_url: null,
  orden: 0,
};

export default function AdminObras() {
  const [obras, setObras] = useState<ObraExpandida[]>([]);
  const [miembros, setMiembros] = useState<Profile[]>([]);
  const [cargando, setCargando] = useState(true);
  const [expandida, setExpandida] = useState<string | null>(null);

  // Modales
  const [obraEditando, setObraEditando] = useState<Partial<Obra> | null>(null);
  const [prodEditando, setProdEditando] = useState<{ obra_id: string; prod: Partial<Produccion> } | null>(null);
  const [repartoAbierto, setRepartoAbierto] = useState<{ produccion_id: string; obra_titulo: string } | null>(null);
  
  // NUEVO: Modal para gestionar equipo creativo
  const [equipoAbierto, setEquipoAbierto] = useState<{ obra_id: string; obra_titulo: string } | null>(null);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void cargar();
  }, []);

  async function cargar() {
    setCargando(true);
    const [obrasRes, prodsRes, miembrosRes] = await Promise.all([
      supabase.from('obras').select('*').order('anio_estreno', { ascending: false }),
      supabase.from('producciones').select('*').order('anio', { ascending: false }),
      supabase.from('profiles').select('*').order('nombre'),
    ]);

    if (obrasRes.data && prodsRes.data) {
      const expandidas = obrasRes.data.map((o) => ({
        ...o,
        producciones: prodsRes.data!.filter((p) => p.obra_id === o.id),
      }));
      setObras(expandidas);
    }
    if (miembrosRes.data) setMiembros(miembrosRes.data);
    setCargando(false);
  }

  // ─── OBRAS ────────────────────────────────────────────────
  function abrirNuevaObra() {
    setObraEditando({ ...OBRA_VACIA });
    setError(null);
  }

  function abrirEditarObra(o: Obra) {
    setObraEditando(o);
    setError(null);
  }

  async function guardarObra(e: FormEvent) {
    e.preventDefault();
    if (!obraEditando || !obraEditando.titulo) return;
    setGuardando(true);
    setError(null);

    const slugFinal = obraEditando.slug?.trim() || slugify(obraEditando.titulo);
    const { producciones, ...datosParaEnviar } = obraEditando as ObraExpandida;
    const datos = { ...datosParaEnviar, slug: slugFinal };

    const resultado = obraEditando.id
      ? await supabase.from('obras').update(datos).eq('id', obraEditando.id)
      : await supabase.from('obras').insert(datos);

    if (resultado.error) {
      setError(resultado.error.message);
      setGuardando(false);
      return;
    }

    setObraEditando(null);
    setGuardando(false);
    await cargar();
  }

  async function eliminarObra(id: string) {
    if (!confirm('¿Eliminar la obra y todas sus producciones? Esta acción no se puede deshacer.')) return;
    await supabase.from('obras').delete().eq('id', id);
    await cargar();
  }

  // ─── PRODUCCIONES ─────────────────────────────────────────
  function abrirNuevaProd(obra_id: string, anio_obra: number | null) {
    setProdEditando({
      obra_id,
      prod: {
        obra_id,
        temporada: `Temporada ${anio_obra ?? new Date().getFullYear()}`,
        anio: anio_obra ?? new Date().getFullYear(),
        director_id: null,
        estado: 'archivada',
        notas: null,
        foto_portada_url: null,
      },
    });
    setError(null);
  }

  function abrirEditarProd(p: Produccion) {
    setProdEditando({ obra_id: p.obra_id, prod: p });
    setError(null);
  }

  async function guardarProd(e: FormEvent) {
    e.preventDefault();
    if (!prodEditando) return;
    const { prod } = prodEditando;
    setGuardando(true);
    setError(null);

    const resultado = prod.id
      ? await supabase.from('producciones').update(prod).eq('id', prod.id)
      : await supabase.from('producciones').insert(prod);

    if (resultado.error) {
      setError(resultado.error.message);
      setGuardando(false);
      return;
    }

    setProdEditando(null);
    setGuardando(false);
    await cargar();
  }

  async function eliminarProd(id: string) {
    if (!confirm('¿Eliminar esta producción y su reparto?')) return;
    await supabase.from('producciones').delete().eq('id', id);
    await cargar();
  }

  function actualizarObra<K extends keyof Obra>(campo: K, valor: Obra[K]) {
    setObraEditando((prev) => (prev ? { ...prev, [campo]: valor } : prev));
  }

  function actualizarProd<K extends keyof Produccion>(campo: K, valor: Produccion[K]) {
    setProdEditando((prev) => (prev ? { ...prev, prod: { ...prev.prod, [campo]: valor } } : prev));
  }

  return (
    <div>
      <div className="flex justify-between items-baseline mb-6">
        <SectionRule>Obras y producciones</SectionRule>
        <button
          onClick={abrirNuevaObra}
          className="bg-ink text-paper px-4 py-2 font-bold text-[11px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#B8253A] transition-all flex items-center gap-2"
        >
          <Plus size={14} /> Nueva obra
        </button>
      </div>

      {cargando ? (
        <p className="text-ink/60 italic">Cargando…</p>
      ) : obras.length === 0 ? (
        <p className="text-ink/60 italic">No hay obras aún. Crea la primera.</p>
      ) : (
        <div className="space-y-3">
          {obras.map((obra) => {
            const abierta = expandida === obra.id;
            return (
              <div key={obra.id} className="border-2 border-ink bg-paper-2">
                {/* Cabecera obra */}
                <div className="px-4 py-3 flex items-center gap-3 hover:bg-paper transition-colors">
                  <button
                    onClick={() => setExpandida(abierta ? null : obra.id)}
                    aria-label={abierta ? 'Cerrar' : 'Abrir'}
                    className="text-ink hover:text-carmin"
                  >
                    <ChevronRight size={18} className={`transition-transform ${abierta ? 'rotate-90' : ''}`} />
                  </button>

                  <div className="w-12 h-12 bg-ink border border-ink overflow-hidden flex-shrink-0">
                    {obra.foto_portada_url ? (
                      <img src={obra.foto_portada_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-paper/40 text-[9px]">SIN FOTO</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-serif font-bold text-ink text-lg leading-tight truncate">{obra.titulo}</div>
                    <div className="font-mono text-[10px] text-ink/50">
                      {obra.anio_estreno ?? '—'} · {obra.producciones.length} producciones
                    </div>
                  </div>

                  <Tag variant={obra.estado === 'en_cartel' ? 'carmin' : 'paper'} className="hidden sm:inline-block">
                    {ESTADO_LABELS[obra.estado]}
                  </Tag>

                  <button
                    onClick={() => abrirEditarObra(obra)}
                    aria-label="Editar obra"
                    className="p-1.5 text-ink hover:text-carmin"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => eliminarObra(obra.id)}
                    aria-label="Eliminar obra"
                    className="p-1.5 text-ink/60 hover:text-carmin"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Contenido expandido (Equipo + Producciones) */}
                {abierta && (
                  <div className="border-t border-ink/30 bg-paper">
                    
                    {/* NUEVO: Fila de Equipo Creativo General */}
                    <div className="px-4 py-3 border-b border-ink/10 flex justify-between items-center bg-paper-2/50">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-ink/60">
                        Equipo creativo (General)
                      </span>
                      <button
                        onClick={() => setEquipoAbierto({ obra_id: obra.id, obra_titulo: obra.titulo })}
                        className="text-ink hover:text-carmin flex items-center gap-1 text-[11px] tracking-widest uppercase font-semibold"
                      >
                        <Briefcase size={14} /> Gestionar Equipo
                      </button>
                    </div>

                    <div className="px-4 py-4">
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="font-mono text-[10px] tracking-widest uppercase text-ink/60">
                          Producciones (Temporadas)
                        </span>
                        <button
                          onClick={() => abrirNuevaProd(obra.id, obra.anio_estreno)}
                          className="bg-paper-2 text-ink border-[1.5px] border-ink px-3 py-1 text-[11px] tracking-widest font-semibold uppercase hover:shadow-brut-sm transition-shadow flex items-center gap-1"
                        >
                          <Plus size={12} /> Nueva temporada
                        </button>
                      </div>

                      {obra.producciones.length === 0 ? (
                        <p className="text-ink/60 italic text-sm">Aún no hay producciones para esta obra.</p>
                      ) : (
                        <div className="space-y-2">
                          {obra.producciones.map((prod) => (
                            <div
                              key={prod.id}
                              className="flex items-center gap-3 px-3 py-2 border border-dashed border-ink"
                            >
                              <div className="w-10 h-12 bg-ink/10 border border-ink/20 overflow-hidden flex-shrink-0">
                                {prod.foto_portada_url ? (
                                  <img src={prod.foto_portada_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-ink/20 text-[8px]">—</div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-serif font-bold text-ink">{prod.temporada}</div>
                                <div className="font-mono text-[10px] text-ink/50">
                                  {prod.anio} · {ESTADO_LABELS[prod.estado]}
                                </div>
                              </div>
                              <button
                                onClick={() => setRepartoAbierto({ produccion_id: prod.id, obra_titulo: obra.titulo })}
                                className="text-ink hover:text-carmin flex items-center gap-1 text-[11px] tracking-widest uppercase font-semibold"
                              >
                                <Users size={14} /> Reparto
                              </button>
                              <button
                                onClick={() => abrirEditarProd(prod)}
                                aria-label="Editar"
                                className="p-1 text-ink hover:text-carmin"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => eliminarProd(prod.id)}
                                aria-label="Eliminar"
                                className="p-1 text-ink/60 hover:text-carmin"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal obra (Sin cambios) */}
      {obraEditando && (
        <Modal abierto={!!obraEditando} onCerrar={() => setObraEditando(null)} titulo={obraEditando.id ? 'Editar obra' : 'Nueva obra'} maxAncho="md">
          <form onSubmit={guardarObra} className="space-y-4">
            {/* ... Todo tu formulario de obra ... */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <ImageUpload valor={obraEditando.foto_portada_url ?? null} onCambio={(url) => actualizarObra('foto_portada_url', url)} carpeta="obras" aspecto="retrato" label="Portada" />
              <div className="flex-1 w-full space-y-3">
                <FormField label="Título" requerido>
                  <input type="text" value={obraEditando.titulo ?? ''} onChange={(e) => actualizarObra('titulo', e.target.value)} onBlur={() => { if (!obraEditando.slug && obraEditando.titulo) { actualizarObra('slug', slugify(obraEditando.titulo)); } }} className="input-brut" required />
                </FormField>
                <FormField label="Slug (URL)" helper="Se genera del título.">
                  <input type="text" value={obraEditando.slug ?? ''} onChange={(e) => actualizarObra('slug', slugify(e.target.value))} className="input-brut font-mono text-xs" />
                </FormField>
                <FormField label="Autor">
                  <input type="text" value={obraEditando.autor ?? ''} onChange={(e) => actualizarObra('autor', e.target.value || null)} className="input-brut" />
                </FormField>
              </div>
            </div>

            <FormField label="Sinopsis">
              <textarea value={obraEditando.sinopsis ?? ''} onChange={(e) => actualizarObra('sinopsis', e.target.value || null)} rows={3} className="input-brut font-serif italic" />
            </FormField>

            <div className="grid sm:grid-cols-3 gap-3">
              <FormField label="Año estreno">
                <input type="number" value={obraEditando.anio_estreno ?? ''} onChange={(e) => actualizarObra('anio_estreno', e.target.value ? Number(e.target.value) : null)} className="input-brut" />
              </FormField>
              <FormField label="Duración (min)">
                <input type="number" value={obraEditando.duracion_minutos ?? ''} onChange={(e) => actualizarObra('duracion_minutos', e.target.value ? Number(e.target.value) : null)} className="input-brut" />
              </FormField>
              <FormField label="Estado" requerido>
                <select value={obraEditando.estado ?? 'archivada'} onChange={(e) => actualizarObra('estado', e.target.value as EstadoObra)} className="input-brut">
                  {Object.entries(ESTADO_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField label="Director general (opcional)">
              <select value={obraEditando.director_id ?? ''} onChange={(e) => actualizarObra('director_id', e.target.value || null)} className="input-brut">
                <option value="">— sin dirección —</option>
                {miembros.map((m) => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </FormField>

            {error && <div className="bg-carmin text-paper px-3 py-2 text-sm font-semibold">{error}</div>}

            <div className="flex justify-between items-center pt-4 border-t-2 border-ink">
              <button type="button" onClick={() => setObraEditando(null)} className="text-ink/60 text-[11px] tracking-widest uppercase font-semibold hover:text-ink">Cancelar</button>
              <button type="submit" disabled={guardando} className="bg-ink text-paper px-6 py-3 font-bold text-[12px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#B8253A] transition-all disabled:opacity-50">
                {guardando ? 'Guardando…' : 'Guardar →'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal producción (Sin cambios) */}
      {prodEditando && (
        <Modal abierto={!!prodEditando} onCerrar={() => setProdEditando(null)} titulo={prodEditando.prod.id ? 'Editar producción' : 'Nueva producción'} maxAncho="sm">
          <form onSubmit={guardarProd} className="space-y-4">
            <ImageUpload
              valor={prodEditando.prod.foto_portada_url ?? null}
              onCambio={(url) => actualizarProd('foto_portada_url', url)}
              carpeta="obras"
              aspecto="paisaje"
              label="Cartel de la temporada"
            />
            <FormField label="Temporada / nombre" requerido>
              <input type="text" value={prodEditando.prod.temporada ?? ''} onChange={(e) => actualizarProd('temporada', e.target.value)} className="input-brut" placeholder="Temporada 2024" required />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Año" requerido>
                <input type="number" value={prodEditando.prod.anio ?? ''} onChange={(e) => actualizarProd('anio', Number(e.target.value))} className="input-brut" required />
              </FormField>
              <FormField label="Estado">
                <select value={prodEditando.prod.estado ?? 'archivada'} onChange={(e) => actualizarProd('estado', e.target.value as EstadoObra)} className="input-brut">
                  {Object.entries(ESTADO_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </FormField>
            </div>
            <FormField label="Director (si difiere del general)">
              <select value={prodEditando.prod.director_id ?? ''} onChange={(e) => actualizarProd('director_id', e.target.value || null)} className="input-brut">
                <option value="">— hereda de la obra —</option>
                {miembros.map((m) => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Notas internas">
              <textarea value={prodEditando.prod.notas ?? ''} onChange={(e) => actualizarProd('notas', e.target.value || null)} rows={2} className="input-brut text-sm" />
            </FormField>
            {error && <div className="bg-carmin text-paper px-3 py-2 text-sm font-semibold">{error}</div>}
            <div className="flex justify-between items-center pt-3 border-t-2 border-ink">
              <button type="button" onClick={() => setProdEditando(null)} className="text-ink/60 text-[11px] tracking-widest uppercase font-semibold hover:text-ink">Cancelar</button>
              <button type="submit" disabled={guardando} className="bg-ink text-paper px-6 py-3 font-bold text-[12px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin disabled:opacity-50">
                {guardando ? 'Guardando…' : 'Guardar →'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Reparto (Sin cambios) */}
      {repartoAbierto && (
        <RepartoEditor
          produccion_id={repartoAbierto.produccion_id}
          obra_titulo={repartoAbierto.obra_titulo}
          miembros={miembros}
          onCerrar={() => setRepartoAbierto(null)}
        />
      )}

      {/* NUEVO: Modal Equipo Creativo */}
      {equipoAbierto && (
        <EquipoEditor
          obra_id={equipoAbierto.obra_id}
          obra_titulo={equipoAbierto.obra_titulo}
          miembros={miembros}
          onCerrar={() => setEquipoAbierto(null)}
        />
      )}
    </div>
  );
}


// ─── Editor de Reparto ────────────────────────────────────────────────────────
interface RepartoEditorProps {
  produccion_id: string;
  obra_titulo: string;
  miembros: Profile[];
  onCerrar: () => void;
}

function RepartoEditor({ produccion_id, obra_titulo, miembros, onCerrar }: RepartoEditorProps) {
  const [reparto, setReparto] = useState<Reparto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [profileNuevo, setProfileNuevo] = useState('');
  const [personajeNuevo, setPersonajeNuevo] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void cargar();
  }, []);

  async function cargar() {
    setCargando(true);
    const { data } = await supabase
      .from('reparto')
      .select('*')
      .eq('produccion_id', produccion_id)
      .order('orden');
    if (data) setReparto(data);
    setCargando(false);
  }

  async function añadir() {
    if (!profileNuevo || !personajeNuevo.trim()) {
      setError('Selecciona un miembro y escribe el nombre del personaje.');
      return;
    }
    setError(null);
    const { error: errIns } = await supabase.from('reparto').insert({
      produccion_id,
      profile_id: profileNuevo,
      personaje: personajeNuevo.trim(),
      orden: reparto.length,
    });
    if (errIns) {
      setError(errIns.message);
      return;
    }
    setProfileNuevo('');
    setPersonajeNuevo('');
    await cargar();
  }

  async function quitar(id: string) {
    await supabase.from('reparto').delete().eq('id', id);
    await cargar();
  }

  function nombreDe(id: string) {
    return miembros.find((m) => m.id === id)?.nombre ?? '—';
  }

  return (
    <Modal abierto onCerrar={onCerrar} titulo={`Reparto · ${obra_titulo}`} maxAncho="md">
      {cargando ? (
        <p className="text-ink/60 italic">Cargando reparto…</p>
      ) : (
        <>
          {reparto.length === 0 ? (
            <p className="text-ink/60 italic mb-4">Aún no hay personajes asignados.</p>
          ) : (
            <div className="space-y-2 mb-6">
              {reparto.map((r) => (
                <div key={r.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center px-3 py-2 border border-ink">
                  <span className="font-serif italic text-ink">{r.personaje}</span>
                  <span className="text-ink font-semibold border-b-2 border-carmin self-center inline-block pb-0.5 w-fit">
                    {nombreDe(r.profile_id)}
                  </span>
                  <button onClick={() => quitar(r.id)} aria-label="Quitar" className="text-ink/60 hover:text-carmin">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t-2 border-ink pt-4 space-y-3">
            <div className="font-mono text-[10px] tracking-widest uppercase text-carmin">Añadir al reparto</div>
            <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
              <FormField label="Personaje">
                <input
                  type="text"
                  value={personajeNuevo}
                  onChange={(e) => setPersonajeNuevo(e.target.value)}
                  className="input-brut"
                  placeholder="Novia, Leonardo…"
                />
              </FormField>
              <FormField label="Miembro">
                <select
                  value={profileNuevo}
                  onChange={(e) => setProfileNuevo(e.target.value)}
                  className="input-brut"
                >
                  <option value="">— elige —</option>
                  {miembros.map((m) => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </FormField>
              <button
                type="button"
                onClick={añadir}
                className="bg-ink text-paper px-4 py-2.5 font-bold text-[11px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#B8253A] transition-all flex items-center gap-1 self-end"
              >
                <Plus size={12} /> Añadir
              </button>
            </div>
            {error && <div className="bg-carmin text-paper px-3 py-2 text-sm font-semibold">{error}</div>}
          </div>
        </>
      )}
    </Modal>
  );
}

// ─── NUEVO: Editor de Equipo Creativo ─────────────────────────────────────────
interface EquipoEditorProps {
  obra_id: string;
  obra_titulo: string;
  miembros: Profile[];
  onCerrar: () => void;
}

function EquipoEditor({ obra_id, obra_titulo, miembros, onCerrar }: EquipoEditorProps) {
  const [equipo, setEquipo] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [profileNuevo, setProfileNuevo] = useState('');
  const [rolNuevo, setRolNuevo] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void cargar();
  }, []);

  async function cargar() {
    setCargando(true);
    // Asumimos que ejecutaste el SQL para crear la tabla 'equipo_creativo'
    const { data } = await supabase
      .from('equipo_creativo')
      .select('*, profiles(nombre)')
      .eq('obra_id', obra_id)
      .order('orden');
    if (data) setEquipo(data);
    setCargando(false);
  }

  async function añadir() {
    if (!profileNuevo || !rolNuevo.trim()) {
      setError('Selecciona un miembro y escribe su rol (ej: Director).');
      return;
    }
    setError(null);
    const { error: errIns } = await supabase.from('equipo_creativo').insert({
      obra_id,
      profile_id: profileNuevo,
      rol: rolNuevo.trim(),
      orden: equipo.length,
    });
    if (errIns) {
      setError(errIns.message);
      return;
    }
    setProfileNuevo('');
    setRolNuevo('');
    await cargar();
  }

  async function quitar(id: string) {
    await supabase.from('equipo_creativo').delete().eq('id', id);
    await cargar();
  }

  return (
    <Modal abierto onCerrar={onCerrar} titulo={`Equipo · ${obra_titulo}`} maxAncho="md">
      {cargando ? (
        <p className="text-ink/60 italic">Cargando equipo…</p>
      ) : (
        <>
          {equipo.length === 0 ? (
            <p className="text-ink/60 italic mb-4">Aún no hay equipo asignado a esta obra.</p>
          ) : (
            <div className="space-y-2 mb-6">
              {equipo.map((miembro) => (
                <div key={miembro.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center px-3 py-2 border border-ink">
                  <span className="font-serif italic text-ink">{miembro.rol}</span>
                  <span className="text-ink font-semibold border-b-2 border-carmin self-center inline-block pb-0.5 w-fit">
                    {miembro.profiles?.nombre}
                  </span>
                  <button onClick={() => quitar(miembro.id)} aria-label="Quitar" className="text-ink/60 hover:text-carmin">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t-2 border-ink pt-4 space-y-3">
            <div className="font-mono text-[10px] tracking-widest uppercase text-carmin">Añadir al equipo</div>
            <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
              <FormField label="Rol">
                <input
                  type="text"
                  value={rolNuevo}
                  onChange={(e) => setRolNuevo(e.target.value)}
                  className="input-brut"
                  placeholder="Director, Vestuario..."
                />
              </FormField>
              <FormField label="Miembro">
                <select
                  value={profileNuevo}
                  onChange={(e) => setProfileNuevo(e.target.value)}
                  className="input-brut"
                >
                  <option value="">— elige —</option>
                  {miembros.map((m) => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </FormField>
              <button
                type="button"
                onClick={añadir}
                className="bg-ink text-paper px-4 py-2.5 font-bold text-[11px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#B8253A] transition-all flex items-center gap-1 self-end"
              >
                <Plus size={12} /> Añadir
              </button>
            </div>
            {error && <div className="bg-carmin text-paper px-3 py-2 text-sm font-semibold">{error}</div>}
          </div>
        </>
      )}
    </Modal>
  );
}