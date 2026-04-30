import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Inbox } from 'lucide-react';
import Modal from '../Modal';
import FormField from '../FormField';
import SectionRule from '../SectionRule';
import { supabase } from '../../lib/supabase';
import type { RepartoPropuesta } from '../../types/database';

interface PropuestaCompleta extends RepartoPropuesta {
  profile: { id: string; nombre: string; slug: string; foto_url: string | null } | null;
  obra: { id: string; titulo: string; slug: string } | null;
  produccion: {
    id: string;
    temporada: string;
    anio: number;
    obra: { id: string; titulo: string; slug: string } | null;
  } | null;
  personajes: { id: string; personaje: string; orden: number }[];
}

type Filtro = 'pendientes' | 'historial';

export default function AdminPropuestas() {
  const [propuestas, setPropuestas] = useState<PropuestaCompleta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>('pendientes');
  const [rechazando, setRechazando] = useState<PropuestaCompleta | null>(null);
  const [notaRechazo, setNotaRechazo] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void cargar();
  }, []);

  async function cargar() {
    setCargando(true);
    const { data } = await supabase
      .from('reparto_propuestas')
      .select(
        `*,
         profile:profiles(id, nombre, slug, foto_url),
         obra:obras(id, titulo, slug),
         produccion:producciones(id, temporada, anio, obra:obras(id, titulo, slug)),
         personajes:reparto_propuestas_personajes(id, personaje, orden)`,
      )
      .order('created_at', { ascending: false });

    if (data) setPropuestas(data as unknown as PropuestaCompleta[]);
    setCargando(false);
  }

  async function aprobar(p: PropuestaCompleta) {
    if (!confirm('¿Aprobar esta propuesta?')) return;
    setProcesando(true);
    setError(null);

    let produccionIdFinal = p.produccion_id;

    // Camino B: crear primero la producción nueva
    if (!produccionIdFinal && p.obra_id && p.temporada_propuesta && p.anio_propuesto) {
      const { data: prodCreada, error: errProd } = await supabase
        .from('producciones')
        .insert({
          obra_id: p.obra_id,
          temporada: p.temporada_propuesta,
          anio: p.anio_propuesto,
          estado: 'archivada',
        })
        .select()
        .single();

      if (errProd || !prodCreada) {
        setError(`No se pudo crear la producción: ${errProd?.message ?? '?'}`);
        setProcesando(false);
        return;
      }
      produccionIdFinal = prodCreada.id;
    }

    if (!produccionIdFinal) {
      setError('Estado inconsistente: sin producción de destino.');
      setProcesando(false);
      return;
    }

    // Insertar reparto: una fila por personaje
    const filasReparto = p.personajes
      .sort((a, b) => a.orden - b.orden)
      .map((per, i) => ({
        produccion_id: produccionIdFinal!,
        profile_id: p.profile_id,
        personaje: per.personaje,
        orden: i,
      }));

    const { error: errReparto } = await supabase.from('reparto').insert(filasReparto);

    if (errReparto) {
      setError(`No se pudo crear el reparto: ${errReparto.message}`);
      setProcesando(false);
      return;
    }

    // Marcar propuesta como aprobada
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from('reparto_propuestas')
      .update({
        estado: 'aprobada',
        resuelta_at: new Date().toISOString(),
        resuelta_por: user?.id ?? null,
      })
      .eq('id', p.id);

    setProcesando(false);
    await cargar();
  }

  async function rechazar() {
    if (!rechazando) return;
    setProcesando(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    const { error: errUpd } = await supabase
      .from('reparto_propuestas')
      .update({
        estado: 'rechazada',
        nota_admin: notaRechazo.trim() || null,
        resuelta_at: new Date().toISOString(),
        resuelta_por: user?.id ?? null,
      })
      .eq('id', rechazando.id);

    setProcesando(false);

    if (errUpd) {
      setError(errUpd.message);
      return;
    }

    setRechazando(null);
    setNotaRechazo('');
    await cargar();
  }

  const pendientes = propuestas.filter((p) => p.estado === 'pendiente');
  const historial = propuestas.filter((p) => p.estado !== 'pendiente');
  const lista = filtro === 'pendientes' ? pendientes : historial;

  return (
    <div>
      <div className="flex justify-between items-baseline mb-5">
        <SectionRule>Propuestas de reparto</SectionRule>
      </div>

      {/* Chips de filtro */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFiltro('pendientes')}
          className={`px-3 py-1.5 text-[11px] tracking-widest uppercase font-semibold border-[1.5px] border-ink transition-shadow ${
            filtro === 'pendientes'
              ? 'bg-ink text-paper shadow-brut-sm'
              : pendientes.length > 0
                ? 'bg-carmin text-paper hover:shadow-brut-sm'
                : 'bg-paper-2 text-ink hover:shadow-brut-sm'
          }`}
        >
          Pendientes · {pendientes.length}
        </button>
        <button
          onClick={() => setFiltro('historial')}
          className={`px-3 py-1.5 text-[11px] tracking-widest uppercase font-semibold border-[1.5px] border-ink transition-shadow ${
            filtro === 'historial'
              ? 'bg-ink text-paper shadow-brut-sm'
              : 'bg-paper-2 text-ink hover:shadow-brut-sm'
          }`}
        >
          Historial · {historial.length}
        </button>
      </div>

      {cargando ? (
        <p className="text-ink/60 italic">Cargando…</p>
      ) : lista.length === 0 ? (
        <div className="text-center py-12 border-[1.5px] border-dashed border-ink/40">
          <Inbox size={32} className="mx-auto text-ink/30 mb-3" />
          <p className="font-serif italic text-ink/60">
            {filtro === 'pendientes'
              ? 'No hay propuestas pendientes de revisión.'
              : 'Aún no hay propuestas resueltas.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lista.map((p) => {
            const obra = p.produccion?.obra ?? p.obra;
            const tempLabel = p.produccion
              ? `${p.produccion.temporada} · ${p.produccion.anio}`
              : `${p.temporada_propuesta} · ${p.anio_propuesto}`;
            const caminoLabel = p.produccion_id ? 'Producción existente' : 'Nueva temporada';

            return (
              <div
                key={p.id}
                className="bg-paper-2 border-2 border-ink shadow-brut p-4"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quién propone */}
                  <div className="flex items-start gap-3 sm:w-56 flex-shrink-0">
                    <div className="w-12 h-12 bg-ink border border-ink overflow-hidden flex-shrink-0">
                      {p.profile?.foto_url ? (
                        <img src={p.profile.foto_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-paper/40 text-[9px]">SIN FOTO</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/equipo/${p.profile?.slug ?? ''}`}
                        className="font-serif font-bold text-ink leading-tight no-underline hover:text-carmin"
                      >
                        {p.profile?.nombre ?? '—'}
                      </Link>
                      <div className="font-mono text-[10px] text-ink/50">
                        {new Date(p.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                      </div>
                    </div>
                  </div>

                  {/* Qué propone */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap mb-1">
                      <span className="font-serif italic font-bold text-ink text-lg">
                        {obra?.titulo ?? '—'}
                      </span>
                      <span className="font-mono text-[9px] tracking-widest uppercase text-carmin">
                        {caminoLabel}
                      </span>
                    </div>
                    <div className="text-xs text-ink/60 mb-2">{tempLabel}</div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {p.personajes
                        .sort((a, b) => a.orden - b.orden)
                        .map((per) => (
                          <span
                            key={per.id}
                            className="bg-paper border-[1.5px] border-ink px-2 py-0.5 text-xs font-semibold"
                          >
                            {per.personaje}
                          </span>
                        ))}
                    </div>
                    {p.nota_actor && (
                      <p className="text-xs italic text-ink/70 mt-2 border-l-2 border-carmin pl-2">
                        "{p.nota_actor}"
                      </p>
                    )}
                  </div>

                  {/* Acciones */}
                  {p.estado === 'pendiente' ? (
                    <div className="flex sm:flex-col gap-2 sm:w-32 flex-shrink-0">
                      <button
                        onClick={() => aprobar(p)}
                        disabled={procesando}
                        className="flex-1 bg-ink text-paper px-3 py-2 font-bold text-[11px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#B8253A] transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 size={12} /> Aprobar
                      </button>
                      <button
                        onClick={() => {
                          setRechazando(p);
                          setNotaRechazo('');
                        }}
                        className="flex-1 bg-paper-2 text-ink border-[1.5px] border-ink px-3 py-2 text-[11px] tracking-widest uppercase font-semibold hover:shadow-brut-sm transition-shadow flex items-center justify-center gap-1"
                      >
                        <XCircle size={12} /> Rechazar
                      </button>
                    </div>
                  ) : (
                    <div className="sm:w-32 flex-shrink-0 flex sm:flex-col items-start gap-2">
                      <span
                        className={`px-2 py-1 text-[10px] tracking-widest uppercase font-semibold border-[1.5px] border-ink ${
                          p.estado === 'aprobada' ? 'bg-carmin text-paper' : 'bg-paper-2 text-ink'
                        }`}
                      >
                        {p.estado}
                      </span>
                      {p.nota_admin && (
                        <p className="text-xs italic text-ink/60">{p.nota_admin}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de rechazo */}
      {rechazando && (
        <Modal abierto onCerrar={() => setRechazando(null)} titulo="Rechazar propuesta" maxAncho="sm">
          <p className="text-sm text-ink/70 mb-4 font-serif italic">
            Vas a rechazar la propuesta de{' '}
            <span className="font-bold not-italic">{rechazando.profile?.nombre}</span>. Si lo
            consideras útil, deja una nota explicando por qué.
          </p>
          <FormField label="Nota (opcional, visible para el actor)">
            <textarea
              value={notaRechazo}
              onChange={(e) => setNotaRechazo(e.target.value.slice(0, 200))}
              rows={3}
              className="input-brut text-sm"
              placeholder="Por ejemplo: la temporada propuesta no coincide con nuestros archivos…"
            />
          </FormField>
          {error && <div className="bg-carmin text-paper px-3 py-2 text-sm font-semibold mt-3">{error}</div>}
          <div className="flex justify-between items-center pt-4 border-t-2 border-ink mt-4">
            <button
              type="button"
              onClick={() => setRechazando(null)}
              className="text-ink/60 text-[11px] tracking-widest uppercase font-semibold hover:text-ink"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={rechazar}
              disabled={procesando}
              className="bg-carmin text-paper px-5 py-2.5 font-bold text-[12px] tracking-widest uppercase border-2 border-ink shadow-brut hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#0F1738] transition-all disabled:opacity-50"
            >
              {procesando ? 'Procesando…' : 'Confirmar rechazo →'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
