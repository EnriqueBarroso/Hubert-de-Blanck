import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionRule from '../components/SectionRule';
import Card from '../components/Card';
import { supabase } from '../lib/supabase';
import { NIVEL_LABELS, TIPO_LABELS } from '../lib/constants';
import type { Profile, NivelMiembro } from '../types/database';

const ORDEN_NIVELES: NivelMiembro[] = ['nucleo', 'colaborador', 'antiguo'];

export default function Equipo() {
  const [miembros, setMiembros] = useState<Profile[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    void cargar();
  }, []);

  async function cargar() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('activo', true)
      .order('nombre');
    if (data) setMiembros(data);
    setCargando(false);
  }

  const grupos = ORDEN_NIVELES.map((nivel) => ({
    nivel,
    miembros: miembros.filter((m) => m.nivel === nivel),
  })).filter((g) => g.miembros.length > 0);

  const tilts = [-0.6, 0.5, -0.3, 0.7, -0.4, 0.2];

  return (
    <>
      <SEO title="Equipo" description="Miembros y colaboradores de la compañía Hubert de Blanck." />

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <SectionRule className="mb-3">Equipo</SectionRule>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold leading-none tracking-tight text-ink mb-2">
            Quiénes <span className="text-carmin italic">somos</span>
          </h1>
          <p className="font-serif italic text-ink/70 text-lg mb-12 max-w-xl">
            El núcleo, los colaboradores que pasan por la sala, y los que ya estuvieron.
          </p>

          {cargando ? (
            <p className="text-ink/60 italic">Cargando equipo…</p>
          ) : grupos.length === 0 ? (
            <p className="text-ink/60 italic">Aún no hay miembros publicados.</p>
          ) : (
            <div className="space-y-12">
              {grupos.map((grupo) => (
                <div key={grupo.nivel}>
                  <div className="flex items-baseline justify-between mb-6 pb-2 border-b-2 border-ink">
                    <h2 className="font-serif text-2xl font-bold text-ink">
                      {NIVEL_LABELS[grupo.nivel]}
                    </h2>
                    <span className="font-mono text-[10px] opacity-60 tracking-wider uppercase">
                      {String(grupo.miembros.length).padStart(2, '0')} miembros
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {grupo.miembros.map((m, i) => (
                      <Link to={`/equipo/${m.slug}`} key={m.id} className="no-underline">
                        <Card
                          tilt={tilts[i % tilts.length]}
                          className="overflow-hidden hover:shadow-brut-lg transition-shadow"
                        >
                          <div className="aspect-[3/4] bg-ink border-b-2 border-ink flex items-center justify-center text-paper/40 font-mono text-xs">
                            {m.foto_url ? (
                              <img src={m.foto_url} alt={m.nombre} className="w-full h-full object-cover" />
                            ) : (
                              'RETRATO'
                            )}
                          </div>
                          <div className="p-3">
                            <p className="font-mono text-[10px] tracking-wider text-carmin uppercase mb-1">
                              {TIPO_LABELS[m.tipo]}
                            </p>
                            <h3 className="font-serif text-base font-bold leading-tight text-ink">{m.nombre}</h3>
                          </div>
                        </Card>
                      </Link>
                    ))}
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
