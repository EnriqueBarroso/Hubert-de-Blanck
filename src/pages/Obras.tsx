import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionRule from '../components/SectionRule';
import Card from '../components/Card';
import Tag from '../components/Tag';
import { supabase } from '../lib/supabase';
import { ESTADO_LABELS } from '../lib/constants';
import type { Obra } from '../types/database';

export default function Obras() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [cargando, setCargando] = useState(true);

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
          <h1 className="font-serif text-5xl sm:text-6xl font-bold leading-none tracking-tight text-ink mb-2">
            Obras
          </h1>
          <p className="font-serif italic text-ink/70 text-lg mb-10 max-w-xl">
            Todas las producciones de la compañía, ordenadas por año.
          </p>

          {cargando ? (
            <p className="text-ink/60 italic">Cargando obras…</p>
          ) : obras.length === 0 ? (
            <p className="text-ink/60 italic">Aún no hay obras publicadas.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {obras.map((obra, i) => (
                <Link to={`/obras/${obra.slug}`} key={obra.id} className="no-underline">
                  <Card tilt={tilts[i % tilts.length]} className="overflow-hidden hover:shadow-brut-lg transition-shadow h-full">
                    <div className="aspect-[4/3] bg-ink border-b-2 border-ink flex items-center justify-center text-paper/40 font-mono text-xs tracking-widest">
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
                        {obra.estado === 'en_cartel' && <Tag variant="carmin">{ESTADO_LABELS[obra.estado]}</Tag>}
                      </div>
                      <h3 className="font-serif text-xl font-bold leading-tight text-ink mb-1">{obra.titulo}</h3>
                      {obra.autor && (
                        <p className="font-serif italic text-ink/60 text-sm">— {obra.autor}</p>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
