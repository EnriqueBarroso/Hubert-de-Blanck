import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionRule from '../components/SectionRule';
import Tag from '../components/Tag';
import Card from '../components/Card';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { COMPANIA } from '../lib/constants';
import type { Obra } from '../types/database';

export default function Home() {
  const [obraActual, setObraActual] = useState<Obra | null>(null);
  const [recientes, setRecientes] = useState<Obra[]>([]);

  useEffect(() => {
    void cargarHome();
  }, []);

  async function cargarHome() {
    // Obra "en cartel" más reciente
    const { data: actualData } = await supabase
      .from('obras')
      .select('*')
      .eq('estado', 'en_cartel')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (actualData) setObraActual(actualData);

    // 3 obras más recientes (cualquier estado)
    const { data: recientesData } = await supabase
      .from('obras')
      .select('*')
      .order('anio_estreno', { ascending: false })
      .limit(3);
    if (recientesData) setRecientes(recientesData);
  }

  const tilts = [-0.8, 0.6, -0.4];

  return (
    <>
      <SEO />

      {/* HERO — obra en cartel */}
      <section className="relative px-6 py-12 sm:py-16 overflow-hidden">
        <span className="pointer-events-none select-none absolute -bottom-6 -right-4 font-mono font-bold text-[22vw] leading-none text-ink opacity-[0.05]">
          2026
        </span>
        <div className="max-w-6xl mx-auto">
          <SectionRule className="mb-3">En escena</SectionRule>

          <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <div>
              {obraActual ? (
                <>
                  <h1 className="font-serif text-5xl sm:text-7xl font-bold leading-[0.95] tracking-tight text-ink mb-2">
                    {obraActual.titulo}
                  </h1>
                  {obraActual.autor && (
                    <p className="font-serif italic text-ink/70 mb-6 text-lg">— de {obraActual.autor}</p>
                  )}
                  {obraActual.sinopsis && (
                    <p className="text-ink leading-relaxed max-w-md mb-6">{obraActual.sinopsis}</p>
                  )}
                  <Button to={`/obras/${obraActual.slug}`}>Ver ficha →</Button>
                </>
              ) : (
                <>
                  <h1 className="font-serif text-5xl sm:text-7xl font-bold leading-[0.95] tracking-tight text-ink mb-2">
                    {COMPANIA.nombre}
                  </h1>
                  <p className="font-serif italic text-ink/70 mb-6 text-lg">
                    — compañía teatral y sala
                  </p>
                  <p className="text-ink leading-relaxed max-w-md mb-6">
                    {COMPANIA.descripcion_corta}
                  </p>
                  <Button to="/obras">Ver repertorio →</Button>
                </>
              )}
            </div>

            <div
              className="aspect-[3/4] bg-ink border-2 border-ink shadow-brut-carmin-lg flex items-center justify-center text-paper/40 font-mono text-xs tracking-widest"
              style={{ transform: 'rotate(1.2deg)' }}
            >
              {obraActual?.foto_portada_url ? (
                <img src={obraActual.foto_portada_url} alt={obraActual.titulo} className="w-full h-full object-cover" />
              ) : (
                'FOTO ESCENA'
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MANIFIESTO en negativo */}
      <section className="bg-ink text-paper px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <SectionRule className="mb-4">Quiénes somos</SectionRule>
          <p className="font-serif italic text-2xl sm:text-3xl leading-snug max-w-2xl mb-5">
            "Compañía y sede a la vez. Hacemos teatro y abrimos la sala a quienes comparten el oficio."
          </p>
          <Link to="/sobre-la-compania" className="text-carmin font-bold text-xs tracking-widest border-b-2 border-carmin pb-0.5 uppercase">
            Conoce nuestra historia →
          </Link>
        </div>
      </section>

      {/* REPERTORIO RECIENTE */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-baseline mb-6">
            <SectionRule>Repertorio</SectionRule>
            <Link to="/obras">
              <Tag>Ver todo →</Tag>
            </Link>
          </div>

          {recientes.length === 0 ? (
            <p className="text-ink/60 italic">Próximamente las obras del repertorio.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recientes.map((obra, i) => (
                <Link to={`/obras/${obra.slug}`} key={obra.id} className="no-underline">
                  <Card tilt={tilts[i % tilts.length]} className="overflow-hidden hover:shadow-brut-lg transition-shadow">
                    <div className="aspect-[4/3] bg-ink border-b-2 border-ink flex items-center justify-center text-paper/40 font-mono text-xs tracking-widest">
                      {obra.foto_portada_url ? (
                        <img src={obra.foto_portada_url} alt={obra.titulo} className="w-full h-full object-cover" />
                      ) : (
                        'FOTO'
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-mono text-[10px] tracking-wider text-ink/60 mb-1">
                        Nº {String(i + 1).padStart(2, '0')} · {obra.anio_estreno ?? '—'}
                      </p>
                      <h3 className="font-serif text-xl font-bold leading-tight text-ink">{obra.titulo}</h3>
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
