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

export default function Obras() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState<Vista>('grid');

  useEffect(() => {
    void cargar();
  }, []);

  async function cargar() {
    const { data } = await supabase
      .from('obras')
      .select('*')
      .order('anio_estreno', { ascending: false });
    if (data) setObras(data);
    setCargando(false);
  }

  const tilts = [-0.8, 0.6, -0.4, 0.5, -0.5, 0.3];

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
            {/* Toggle de vista */}
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {obras.map((obra, i) => {
                const destacada = obra.estado === 'en_cartel';
                return (
                  <Link
                    to={`/obras/${obra.slug}`}
                    key={obra.id}
                    className={`no-underline ${destacada ? 'sm:col-span-2 lg:col-span-2' : ''}`}
                  >
                    <Card tilt={tilts[i % tilts.length]} className="overflow-hidden hover:shadow-brut-lg transition-shadow h-full">
                      <div className={`bg-ink border-b-2 border-ink flex items-center justify-center text-paper/40 font-mono text-xs tracking-widest ${destacada ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                        {obra.foto_portada_url ? (
                          <img src={obra.foto_portada_url} alt={obra.titulo} className="w-full h-full object-cover" />
                        ) : (
                          'FOTO'
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-baseline justify-between mb-2">
                          <p className="font-mono text-[10px] tracking-wider text-ink/60">
                            Nº {String(i + 1).padStart(2, '0')} · {obra.anio_estreno ?? '—'}
                          </p>
                          {destacada && <Tag variant="carmin">{ESTADO_LABELS[obra.estado]}</Tag>}
                        </div>
                        <h3 className={`font-serif font-bold leading-tight text-ink mb-1 ${destacada ? 'text-3xl' : 'text-xl'}`}>
                          {obra.titulo}
                        </h3>
                        {obra.autor && (
                          <p className="font-serif italic text-ink/60 text-sm">— {obra.autor}</p>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Vista lista */
            <div className="divide-y-2 divide-ink">
              {obras.map((obra, i) => {
                const destacada = obra.estado === 'en_cartel';
                return (
                  <Link
                    to={`/obras/${obra.slug}`}
                    key={obra.id}
                    className="group no-underline flex items-baseline gap-6 py-5 hover:bg-ink/[0.03] transition-colors -mx-3 px-3"
                  >
                    {/* Año */}
                    <span className="font-mono text-2xl font-bold text-ink/25 w-16 shrink-0 group-hover:text-carmin transition-colors">
                      {obra.anio_estreno ?? '—'}
                    </span>

                    {/* Título + autor + sinopsis */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-ink group-hover:text-carmin transition-colors">
                          {obra.titulo}
                        </h3>
                        {obra.autor && (
                          <span className="font-serif italic text-ink/50 text-base shrink-0">— {obra.autor}</span>
                        )}
                        {destacada && <Tag variant="carmin">{ESTADO_LABELS[obra.estado]}</Tag>}
                      </div>
                      {obra.sinopsis && (
                        <p className="text-ink/50 text-sm leading-relaxed mt-1 line-clamp-1">
                          {obra.sinopsis}
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
          )}
        </div>
      </section>
    </>
  );
}
