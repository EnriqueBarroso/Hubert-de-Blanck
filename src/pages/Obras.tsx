import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionRule from '../components/SectionRule';
import Card from '../components/Card';
import Tag from '../components/Tag';
import { supabase } from '../lib/supabase';
import { ESTADO_LABELS } from '../lib/constants';
import type { Obra } from '../types/database';

type Vista = 'grid' | 'lista';

type ObraConProducciones = Obra & {
  producciones: { anio: number; temporada: string; foto_portada_url: string | null }[];
};

interface Aparicion {
  obra: ObraConProducciones;
  anio: number;
  tipo: 'estreno' | 'reposicion';
  foto: string | null;
}

function getPeriodoLabel(anio: number): string {
  const periodoIndex = Math.floor((anio - 1991) / 5);
  const inicio = 1991 + periodoIndex * 5;
  return `${inicio}–${inicio + 4}`;
}

function construirApariciones(obras: ObraConProducciones[]): [string, Aparicion[]][] {
  const grupos = new Map<string, Map<string, Aparicion>>();

  for (const obra of obras) {
    // Reúne todos los quinquenios en los que esta obra estuvo activa.
    // La premiere tiene prioridad si cae en el mismo quinquenio que una producción.
    const quinqueniosObra = new Map<string, { anio: number; tipo: 'estreno' | 'reposicion'; foto: string | null }>();

    if (obra.anio_estreno) {
      quinqueniosObra.set(getPeriodoLabel(obra.anio_estreno), {
        anio: obra.anio_estreno,
        tipo: 'estreno',
        foto: null,
      });
    }

    // Ordena las producciones de más antigua a más nueva para tomar la primera de cada quinquenio.
    const prodsOrdenadas = [...obra.producciones].sort((a, b) => a.anio - b.anio);
    for (const prod of prodsOrdenadas) {
      if (!prod.anio) continue;
      const periodo = getPeriodoLabel(prod.anio);
      if (!quinqueniosObra.has(periodo)) {
        quinqueniosObra.set(periodo, { anio: prod.anio, tipo: 'reposicion', foto: prod.foto_portada_url ?? null });
      }
    }

    for (const [periodo, info] of quinqueniosObra) {
      if (!grupos.has(periodo)) grupos.set(periodo, new Map());
      grupos.get(periodo)!.set(obra.id, { obra, anio: info.anio, tipo: info.tipo, foto: info.foto });
    }
  }

  const entries = Array.from(grupos.entries()).map(([periodo, obraMap]) => {
    const apariciones = Array.from(obraMap.values()).sort((a, b) => {
      // Estrenos primero; dentro de cada tipo, descendente por año.
      if (a.tipo !== b.tipo) return a.tipo === 'estreno' ? -1 : 1;
      return b.anio - a.anio;
    });
    return [periodo, apariciones] as [string, Aparicion[]];
  });

  // Quinquenios de más reciente a más antiguo.
  entries.sort((a, b) => parseInt(b[0]) - parseInt(a[0]));

  return entries;
}

export default function Obras() {
  const [obras, setObras] = useState<ObraConProducciones[]>([]);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState<Vista>('grid');

  useEffect(() => {
    void cargar();
  }, []);

  async function cargar() {
    const { data } = await supabase
      .from('obras')
      .select('*, producciones(anio, temporada, foto_portada_url)')
      .order('anio_estreno', { ascending: false });
    if (data) setObras(data as ObraConProducciones[]);
    setCargando(false);
  }

  const tilts = [-0.8, 0.6, -0.4, 0.5, -0.5, 0.3];
  const grupos = construirApariciones(obras);
  // Índice global para la numeración Nº 01, Nº 02… (solo por estreno).
  const indiceGlobal = new Map(obras.map((o, i) => [o.id, i]));

  return (
    <>
      <SEO title="Repertorio" description="Todas las obras del repertorio de la compañía Hubert de Blanck." />

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <SectionRule className="mb-3">Repertorio completo</SectionRule>

          <div className="flex items-end justify-between mb-2 gap-4">
            <h1 className="font-serif text-5xl sm:text-6xl font-bold leading-none tracking-tight text-ink">
              Obras
            </h1>
            <div className="flex items-center gap-1 font-mono text-[10px] tracking-widest uppercase border-2 border-ink overflow-hidden shrink-0">
              <button
                onClick={() => setVista('grid')}
                className={`px-3 py-1.5 transition-colors ${vista === 'grid' ? 'bg-ink text-paper' : 'text-ink/50 hover:text-ink'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setVista('lista')}
                className={`px-3 py-1.5 transition-colors ${vista === 'lista' ? 'bg-ink text-paper' : 'text-ink/50 hover:text-ink'}`}
              >
                Lista
              </button>
            </div>
          </div>

          <p className="font-serif italic text-ink/70 text-lg mb-10 max-w-xl">
            Todas las producciones de la compañía, ordenadas por año.
          </p>

          {cargando ? (
            <p className="text-ink/60 italic">Cargando obras…</p>
          ) : obras.length === 0 ? (
            <p className="text-ink/60 italic">Aún no hay obras publicadas.</p>
          ) : vista === 'grid' ? (
            <div className="space-y-14">
              {grupos.map(([periodo, apariciones]) => (
                <div key={periodo}>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-ink/40 shrink-0">Época</span>
                    <h2 className="font-serif text-3xl font-bold text-ink shrink-0">{periodo}</h2>
                    <div className="flex-1 border-t-2 border-ink/20" />
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {apariciones.map((ap) => {
                      const i = indiceGlobal.get(ap.obra.id)!;
                      const destacada = ap.tipo === 'estreno' && ap.obra.estado === 'en_cartel';
                      return (
                        <Link
                          to={`/obras/${ap.obra.slug}`}
                          key={`${ap.obra.id}-${ap.anio}`}
                          className={`no-underline ${destacada ? 'sm:col-span-2 lg:col-span-2' : ''}`}
                        >
                          <Card tilt={tilts[i % tilts.length]} className="overflow-hidden hover:shadow-brut-lg transition-shadow h-full">
                            <div className={`bg-ink border-b-2 border-ink flex items-center justify-center text-paper/40 font-mono text-xs tracking-widest ${destacada ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                              {(ap.foto ?? ap.obra.foto_portada_url) ? (
                                <img
                                  src={(ap.foto ?? ap.obra.foto_portada_url)!}
                                  alt={ap.obra.titulo}
                                  className={`w-full h-full object-cover ${ap.tipo === 'reposicion' ? 'opacity-60' : ''}`}
                                />
                              ) : (
                                'FOTO'
                              )}
                            </div>
                            <div className="p-4">
                              <div className="flex items-baseline justify-between mb-2">
                                {ap.tipo === 'estreno' ? (
                                  <p className="font-mono text-[10px] tracking-wider text-ink/60">
                                    Nº {String(i + 1).padStart(2, '0')} · {ap.obra.anio_estreno ?? '—'}
                                  </p>
                                ) : (
                                  <p className="font-mono text-[10px] tracking-wider text-carmin flex items-center gap-1">
                                    ↺ Reposición · {ap.anio}
                                  </p>
                                )}
                                {destacada && <Tag variant="carmin">{ESTADO_LABELS[ap.obra.estado]}</Tag>}
                              </div>
                              <h3 className={`font-serif font-bold leading-tight text-ink mb-1 ${destacada ? 'text-3xl' : 'text-xl'}`}>
                                {ap.obra.titulo}
                              </h3>
                              {ap.obra.autor && (
                                <p className="font-serif italic text-ink/60 text-sm">— {ap.obra.autor}</p>
                              )}
                              {ap.tipo === 'reposicion' && ap.obra.anio_estreno && (
                                <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mt-2">
                                  Estreno original · {ap.obra.anio_estreno}
                                </p>
                              )}
                            </div>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Vista lista */
            <div className="space-y-10">
              {grupos.map(([periodo, apariciones]) => (
                <div key={periodo}>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-ink/40 shrink-0">Época</span>
                    <h2 className="font-serif text-3xl font-bold text-ink shrink-0">{periodo}</h2>
                    <div className="flex-1 border-t-2 border-ink/20" />
                  </div>

                  <div className="divide-y-2 divide-ink">
                    {apariciones.map((ap) => {
                      const destacada = ap.tipo === 'estreno' && ap.obra.estado === 'en_cartel';
                      return (
                        <Link
                          to={`/obras/${ap.obra.slug}`}
                          key={`${ap.obra.id}-${ap.anio}`}
                          className="group no-underline flex items-baseline gap-6 py-5 hover:bg-ink/[0.03] transition-colors -mx-3 px-3"
                        >
                          {/* Columna izquierda: año o indicador de reposición */}
                          {ap.tipo === 'estreno' ? (
                            <span className="font-mono text-2xl font-bold text-ink/25 w-16 shrink-0 group-hover:text-carmin transition-colors">
                              {ap.obra.anio_estreno ?? '—'}
                            </span>
                          ) : (
                            <span className="font-mono font-bold text-carmin/40 w-16 shrink-0 group-hover:text-carmin transition-colors text-center leading-none">
                              <span className="block text-xl">↺</span>
                              <span className="block text-sm">{ap.anio}</span>
                            </span>
                          )}

                          {/* Título + autor + metadatos */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-3 flex-wrap">
                              <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-ink group-hover:text-carmin transition-colors">
                                {ap.obra.titulo}
                              </h3>
                              {ap.obra.autor && (
                                <span className="font-serif italic text-ink/50 text-base shrink-0">— {ap.obra.autor}</span>
                              )}
                              {destacada && <Tag variant="carmin">{ESTADO_LABELS[ap.obra.estado]}</Tag>}
                            </div>
                            {ap.tipo === 'reposicion' && ap.obra.anio_estreno && (
                              <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mt-0.5">
                                Estreno original · {ap.obra.anio_estreno}
                              </p>
                            )}
                            {ap.obra.sinopsis && (
                              <p className="text-ink/50 text-sm leading-relaxed mt-1 line-clamp-1">
                                {ap.obra.sinopsis}
                              </p>
                            )}
                          </div>

                          {/* Flecha */}
                          <span className="font-mono text-ink/20 group-hover:text-carmin group-hover:translate-x-1 transition-all shrink-0">
                            →
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
