import { useEffect, useState, type FormEvent } from 'react';
import { Plus, X, Search } from 'lucide-react';
import Modal from './Modal';
import FormField from './FormField';
import { supabase } from '../lib/supabase';
import type { Obra, Produccion } from '../types/database';

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  profileId: string;
  onCreada: () => void;
}

type Paso = 'elegir-obra' | 'elegir-produccion' | 'personajes';
type Camino = null | 'A' | 'B'; // A: producción existente, B: temporada nueva

export default function PropuestaRepartoForm({ abierto, onCerrar, profileId, onCreada }: Props) {
  const [paso, setPaso] = useState<Paso>('elegir-obra');
  const [camino, setCamino] = useState<Camino>(null);

  // Catálogo
  const [obras, setObras] = useState<Obra[]>([]);
  const [producciones, setProducciones] = useState<Produccion[]>([]);
  const [busqueda, setBusqueda] = useState('');

  // Selecciones
  const [obraSel, setObraSel] = useState<Obra | null>(null);
  const [produccionSel, setProduccionSel] = useState<Produccion | null>(null);
  const [temporadaNueva, setTemporadaNueva] = useState('');
  const [anioNuevo, setAnioNuevo] = useState<number | ''>('');
  const [personajes, setPersonajes] = useState<string[]>(['']);
  const [notaActor, setNotaActor] = useState('');

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (abierto) {
      void cargarObras();
      reset();
    }
  }, [abierto]);

  function reset() {
    setPaso('elegir-obra');
    setCamino(null);
    setObraSel(null);
    setProduccionSel(null);
    setTemporadaNueva('');
    setAnioNuevo('');
    setPersonajes(['']);
    setNotaActor('');
    setBusqueda('');
    setError(null);
  }

  async function cargarObras() {
    const { data } = await supabase.from('obras').select('*').order('titulo');
    if (data) setObras(data);
  }

  async function cargarProducciones(obra_id: string) {
    const { data } = await supabase
      .from('producciones')
      .select('*')
      .eq('obra_id', obra_id)
      .order('anio', { ascending: false });
    if (data) setProducciones(data);
  }

  async function elegirObra(obra: Obra) {
    setObraSel(obra);
    await cargarProducciones(obra.id);
    setPaso('elegir-produccion');
  }

  function elegirProduccion(prod: Produccion) {
    setProduccionSel(prod);
    setCamino('A');
    setPaso('personajes');
  }

  function elegirTemporadaNueva() {
    setProduccionSel(null);
    setCamino('B');
    setPaso('personajes');
  }

  function añadirPersonaje() {
    setPersonajes([...personajes, '']);
  }

  function quitarPersonaje(idx: number) {
    setPersonajes(personajes.filter((_, i) => i !== idx));
  }

  function actualizarPersonaje(idx: number, val: string) {
    setPersonajes(personajes.map((p, i) => (i === idx ? val : p)));
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!camino) return;

    const personajesLimpios = personajes.map((p) => p.trim()).filter(Boolean);
    if (personajesLimpios.length === 0) {
      setError('Indica al menos un personaje.');
      return;
    }

    if (camino === 'B') {
      if (!temporadaNueva.trim() || !anioNuevo) {
        setError('Indica nombre de temporada y año.');
        return;
      }
    }

    setEnviando(true);
    setError(null);

    // 1. Crear la propuesta
    const datosPropuesta = camino === 'A'
      ? {
          profile_id: profileId,
          produccion_id: produccionSel!.id,
          nota_actor: notaActor.trim() || null,
        }
      : {
          profile_id: profileId,
          obra_id: obraSel!.id,
          temporada_propuesta: temporadaNueva.trim(),
          anio_propuesto: Number(anioNuevo),
          nota_actor: notaActor.trim() || null,
        };

    const { data: propuestaCreada, error: errProp } = await supabase
      .from('reparto_propuestas')
      .insert(datosPropuesta)
      .select()
      .single();

    if (errProp || !propuestaCreada) {
      setError(errProp?.message ?? 'No pudimos crear la propuesta.');
      setEnviando(false);
      return;
    }

    // 2. Crear los personajes
    const personajesData = personajesLimpios.map((p, i) => ({
      propuesta_id: propuestaCreada.id,
      personaje: p,
      orden: i,
    }));

    const { error: errPers } = await supabase
      .from('reparto_propuestas_personajes')
      .insert(personajesData);

    if (errPers) {
      // Rollback simple: borrar la propuesta huérfana
      await supabase.from('reparto_propuestas').delete().eq('id', propuestaCreada.id);
      setError(errPers.message);
      setEnviando(false);
      return;
    }

    setEnviando(false);
    onCreada();
    onCerrar();
  }

  const obrasFiltradas = busqueda.trim()
    ? obras.filter((o) =>
        o.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        (o.autor ?? '').toLowerCase().includes(busqueda.toLowerCase()),
      )
    : obras;

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo="Añadir obra a mi trayectoria" maxAncho="md">
      {/* Paso 1: elegir obra */}
      {paso === 'elegir-obra' && (
        <div>
          <p className="text-sm text-ink/70 mb-4 font-serif italic">
            Busca la obra en la que participaste. La dirección revisará tu propuesta.
          </p>
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar obra por título o autor…"
              className="input-brut pl-9"
              autoFocus
            />
          </div>

          {obrasFiltradas.length === 0 ? (
            <p className="text-ink/60 italic text-sm">No se encontraron obras. Pídele a la dirección que la cree primero.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto border border-ink/30">
              {obrasFiltradas.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => elegirObra(o)}
                  className="w-full text-left px-4 py-3 border-b border-ink/20 hover:bg-paper-2 transition-colors flex justify-between items-baseline"
                >
                  <span>
                    <span className="font-serif font-bold text-ink">{o.titulo}</span>
                    {o.autor && <span className="font-serif italic text-ink/60 text-sm"> · {o.autor}</span>}
                  </span>
                  {o.anio_estreno && <span className="font-mono text-[10px] text-ink/50">{o.anio_estreno}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Paso 2: elegir producción */}
      {paso === 'elegir-produccion' && obraSel && (
        <div>
          <button
            type="button"
            onClick={() => setPaso('elegir-obra')}
            className="text-[11px] tracking-widest uppercase text-ink/60 hover:text-carmin mb-3"
          >
            ← Cambiar obra
          </button>
          <p className="text-sm text-ink/70 mb-4">
            <span className="font-serif italic">Has elegido</span>{' '}
            <span className="font-serif font-bold text-ink">{obraSel.titulo}</span>
            {obraSel.autor && <span className="font-serif italic text-ink/60"> · {obraSel.autor}</span>}
          </p>

          <p className="font-mono text-[10px] tracking-widest uppercase text-carmin mb-3">¿En qué temporada participaste?</p>

          {producciones.length === 0 ? (
            <p className="text-ink/60 italic text-sm mb-4">Esta obra no tiene temporadas registradas todavía.</p>
          ) : (
            <div className="border border-ink/30 mb-3">
              {producciones.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => elegirProduccion(p)}
                  className="w-full text-left px-4 py-3 border-b border-ink/20 last:border-b-0 hover:bg-paper-2 transition-colors flex justify-between items-baseline"
                >
                  <span className="font-serif font-bold text-ink">{p.temporada}</span>
                  <span className="font-mono text-[10px] text-ink/50">{p.anio}</span>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={elegirTemporadaNueva}
            className="w-full bg-paper-2 text-ink border-[1.5px] border-dashed border-ink px-4 py-3 text-[11px] tracking-widest uppercase font-semibold hover:bg-paper transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Mi temporada no está en la lista
          </button>
        </div>
      )}

      {/* Paso 3: personajes (común a A y B) */}
      {paso === 'personajes' && (
        <form onSubmit={enviar}>
          <button
            type="button"
            onClick={() => setPaso('elegir-produccion')}
            className="text-[11px] tracking-widest uppercase text-ink/60 hover:text-carmin mb-3"
          >
            ← Atrás
          </button>

          <div className="bg-paper-2 border-[1.5px] border-ink p-3 mb-4 text-sm">
            <div className="font-serif font-bold text-ink">{obraSel?.titulo}</div>
            {camino === 'A' && produccionSel && (
              <div className="font-serif italic text-ink/70 text-xs">{produccionSel.temporada} · {produccionSel.anio}</div>
            )}
            {camino === 'B' && (
              <div className="font-serif italic text-ink/70 text-xs">Nueva temporada (la rellenas abajo)</div>
            )}
          </div>

          {/* Datos de temporada nueva si camino B */}
          {camino === 'B' && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <FormField label="Nombre temporada" requerido>
                <input
                  type="text"
                  value={temporadaNueva}
                  onChange={(e) => setTemporadaNueva(e.target.value)}
                  className="input-brut"
                  placeholder="Temporada 2019"
                  required
                />
              </FormField>
              <FormField label="Año" requerido>
                <input
                  type="number"
                  value={anioNuevo}
                  onChange={(e) => setAnioNuevo(e.target.value ? Number(e.target.value) : '')}
                  className="input-brut"
                  placeholder="2019"
                  min={1900}
                  max={2100}
                  required
                />
              </FormField>
            </div>
          )}

          {/* Personajes */}
          <div className="mb-4">
            <label className="block font-mono text-[10px] opacity-60 tracking-wider uppercase mb-2">
              Personaje(s) que interpretaste *
            </label>
            <div className="space-y-2">
              {personajes.map((p, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={p}
                    onChange={(e) => actualizarPersonaje(i, e.target.value)}
                    className="input-brut flex-1"
                    placeholder={i === 0 ? 'Hamlet' : 'Otro personaje…'}
                    required={i === 0}
                  />
                  {personajes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => quitarPersonaje(i)}
                      className="text-ink/60 hover:text-carmin p-2"
                      aria-label="Quitar personaje"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={añadirPersonaje}
              className="mt-2 text-[11px] tracking-widest uppercase text-carmin font-semibold flex items-center gap-1 hover:underline"
            >
              <Plus size={12} /> Añadir otro personaje
            </button>
          </div>

          {/* Nota opcional */}
          <FormField label="Nota para la dirección (opcional)">
            <textarea
              value={notaActor}
              onChange={(e) => setNotaActor(e.target.value.slice(0, 200))}
              rows={2}
              className="input-brut text-sm"
              placeholder="Cualquier contexto que ayude a verificar tu participación…"
            />
          </FormField>

          {error && (
            <div className="bg-carmin text-paper px-3 py-2 text-sm font-semibold mt-3">{error}</div>
          )}

          <div className="flex justify-between items-center pt-4 border-t-2 border-ink mt-4">
            <button
              type="button"
              onClick={onCerrar}
              className="text-ink/60 text-[11px] tracking-widest uppercase font-semibold hover:text-ink"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="bg-ink text-paper px-6 py-3 font-bold text-[12px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#B8253A] transition-all disabled:opacity-50"
            >
              {enviando ? 'Enviando…' : 'Enviar propuesta →'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
