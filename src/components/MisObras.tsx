import { useEffect, useState } from 'react';
import { Plus, Clock, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import Card from './Card';
import SectionRule from './SectionRule';
import PropuestaRepartoForm from './PropuestaRepartoForm';
import { supabase } from '../lib/supabase';
import type { RepartoPropuesta } from '../types/database';

interface Props {
  profileId: string;
}

interface FilaTrayectoria {
  produccion_id: string;
  obra_titulo: string;
  obra_slug: string;
  anio: number;
  temporada: string;
  personaje: string;
}

interface PropuestaConDetalle extends RepartoPropuesta {
  obra_titulo: string;
  produccion_temporada: string | null;
  produccion_anio: number | null;
  personajes: string[];
}

export default function MisObras({ profileId }: Props) {
  const [trayectoria, setTrayectoria] = useState<FilaTrayectoria[]>([]);
  const [propuestas, setPropuestas] = useState<PropuestaConDetalle[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    void cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  async function cargar() {
    setCargando(true);
    await Promise.all([cargarTrayectoria(), cargarPropuestas()]);
    setCargando(false);
  }

  async function cargarTrayectoria() {
    const { data } = await supabase
      .from('reparto')
      .select(
        `personaje,
         produccion:producciones(id, anio, temporada,
           obra:obras(titulo, slug))`,
      )
      .eq('profile_id', profileId);

    if (!data) return;

    type Raw = {
      personaje: string;
      produccion: {
        id: string;
        anio: number;
        temporada: string;
        obra: { titulo: string; slug: string } | null;
      } | null;
    };

    const filas: FilaTrayectoria[] = (data as unknown as Raw[])
      .filter((r) => r.produccion && r.produccion.obra)
      .map((r) => ({
        produccion_id: r.produccion!.id,
        obra_titulo: r.produccion!.obra!.titulo,
        obra_slug: r.produccion!.obra!.slug,
        anio: r.produccion!.anio,
        temporada: r.produccion!.temporada,
        personaje: r.personaje,
      }))
      .sort((a, b) => b.anio - a.anio);

    setTrayectoria(filas);
  }

  async function cargarPropuestas() {
    const { data } = await supabase
      .from('reparto_propuestas')
      .select(
        `*,
         obra:obras(titulo),
         produccion:producciones(temporada, anio, obra:obras(titulo)),
         personajes:reparto_propuestas_personajes(personaje, orden)`,
      )
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (!data) return;

    type Raw = RepartoPropuesta & {
      obra: { titulo: string } | null;
      produccion: {
        temporada: string;
        anio: number;
        obra: { titulo: string } | null;
      } | null;
      personajes: { personaje: string; orden: number }[];
    };

    const procesadas: PropuestaConDetalle[] = (data as unknown as Raw[]).map((p) => ({
      ...p,
      obra_titulo: p.produccion?.obra?.titulo ?? p.obra?.titulo ?? '—',
      produccion_temporada: p.produccion?.temporada ?? p.temporada_propuesta ?? null,
      produccion_anio: p.produccion?.anio ?? p.anio_propuesto ?? null,
      personajes: p.personajes
        .sort((a, b) => a.orden - b.orden)
        .map((x) => x.personaje),
    }));

    setPropuestas(procesadas);
  }

  async function cancelarPropuesta(id: string) {
    if (!confirm('¿Cancelar esta propuesta?')) return;
    await supabase.from('reparto_propuestas').delete().eq('id', id);
    await cargarPropuestas();
  }

  if (cargando) {
    return <p className="text-ink/60 italic">Cargando tu trayectoria…</p>;
  }

  const propuestasPendientes = propuestas.filter((p) => p.estado === 'pendiente');
  const propuestasResueltas = propuestas.filter((p) => p.estado !== 'pendiente');

  return (
    <>
      <Card tilt={-0.2} className="p-6 space-y-6">
        <div className="flex justify-between items-baseline">
          <SectionRule>Mis obras</SectionRule>
          <button
            onClick={() => setModalAbierto(true)}
            className="bg-ink text-paper px-4 py-2 font-bold text-[11px] tracking-widest uppercase border-2 border-ink shadow-brut-carmin hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#B8253A] transition-all flex items-center gap-2"
          >
            <Plus size={14} /> Añadir
          </button>
        </div>

        {/* Trayectoria aprobada */}
        {trayectoria.length === 0 && propuestas.length === 0 ? (
          <div className="text-center py-6 border-[1.5px] border-dashed border-ink/40">
            <p className="font-serif italic text-ink/60 mb-1">Aún no tienes obras en tu trayectoria.</p>
            <p className="text-xs text-ink/50">Añade la primera con el botón de arriba.</p>
          </div>
        ) : trayectoria.length > 0 && (
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-ink/60 mb-3">Confirmadas por la dirección</p>
            <div className="space-y-2">
              {trayectoria.map((fila) => (
                <div
                  key={`${fila.produccion_id}-${fila.personaje}`}
                  className="grid grid-cols-[60px_1fr_auto] gap-3 items-baseline py-2 border-b border-dashed border-ink/40"
                >
                  <span className="font-mono text-carmin font-bold text-sm">{fila.anio}</span>
                  <div>
                    <div className="font-serif italic font-bold text-ink leading-tight">{fila.obra_titulo}</div>
                    <div className="text-xs text-ink/60">{fila.temporada}</div>
                  </div>
                  <span className="text-sm text-ink border-b-2 border-carmin">{fila.personaje}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Propuestas pendientes */}
        {propuestasPendientes.length > 0 && (
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-ink/60 mb-3 flex items-center gap-2">
              <Clock size={11} /> Pendientes de revisión
            </p>
            <div className="space-y-2">
              {propuestasPendientes.map((p) => (
                <div key={p.id} className="bg-paper-2/50 border border-dashed border-ink/40 px-3 py-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-serif italic font-bold text-ink leading-tight">{p.obra_titulo}</div>
                      <div className="text-xs text-ink/60">
                        {p.produccion_temporada} {p.produccion_anio && `· ${p.produccion_anio}`}
                        {p.obra_id && !p.produccion_id && (
                          <span className="ml-1 italic">· nueva temporada propuesta</span>
                        )}
                      </div>
                      <div className="text-sm text-ink mt-1">
                        {p.personajes.map((per, i) => (
                          <span key={i} className="inline-block border-b-2 border-carmin/40 mr-2">{per}</span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => cancelarPropuesta(p.id)}
                      aria-label="Cancelar propuesta"
                      className="text-ink/40 hover:text-carmin p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Propuestas resueltas (rechazadas o ya aprobadas pero aún en log) */}
        {propuestasResueltas.length > 0 && (
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-ink/60 mb-3">Historial</p>
            <div className="space-y-2">
              {propuestasResueltas.map((p) => (
                <div key={p.id} className="px-3 py-2 text-sm">
                  <div className="flex items-baseline gap-2">
                    {p.estado === 'aprobada' ? (
                      <CheckCircle2 size={14} className="text-carmin flex-shrink-0" />
                    ) : (
                      <XCircle size={14} className="text-ink/40 flex-shrink-0" />
                    )}
                    <span className="font-serif italic font-bold text-ink">{p.obra_titulo}</span>
                    <span className="text-xs text-ink/50">
                      {p.estado === 'aprobada' ? 'aprobada' : 'rechazada'}
                    </span>
                  </div>
                  {p.estado === 'rechazada' && p.nota_admin && (
                    <p className="text-xs text-ink/60 italic mt-1 ml-5">{p.nota_admin}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <PropuestaRepartoForm
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        profileId={profileId}
        onCreada={cargar}
      />
    </>
  );
}
