import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionRule from '../components/SectionRule';
import Tag from '../components/Tag';
import Card from '../components/Card';
import { supabase } from '../lib/supabase';
import { ESTADO_LABELS } from '../lib/constants';
import type { Obra, Produccion, Reparto, ObraFoto, ObraVideo, Profile } from '../types/database';

interface RepartoConProfile extends Reparto {
  profile: Pick<Profile, 'id' | 'nombre' | 'slug'> | null;
}

interface ProduccionConReparto extends Produccion {
  reparto: RepartoConProfile[];
  director: Pick<Profile, 'nombre' | 'slug'> | null;
}

export default function ObraDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const [obra, setObra] = useState<Obra | null>(null);
  const [director, setDirector] = useState<Profile | null>(null);
  const [producciones, setProducciones] = useState<ProduccionConReparto[]>([]);
  const [fotos, setFotos] = useState<ObraFoto[]>([]);
  const [videos, setVideos] = useState<ObraVideo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [noEncontrada, setNoEncontrada] = useState(false);

  useEffect(() => {
    if (!slug) return;
    void cargar(slug);
  }, [slug]);

  async function cargar(slugObra: string) {
    setCargando(true);
    const { data: obraData } = await supabase
      .from('obras')
      .select('*')
      .eq('slug', slugObra)
      .maybeSingle();

    if (!obraData) {
      setNoEncontrada(true);
      setCargando(false);
      return;
    }
    setObra(obraData);

    if (obraData.director_id) {
      const { data: dirData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', obraData.director_id)
        .maybeSingle();
      if (dirData) setDirector(dirData);
    }

    // Producciones con reparto y director específico
    const { data: prodData } = await supabase
      .from('producciones')
      .select('*, director:profiles!producciones_director_id_fkey(nombre, slug), reparto(*, profile:profiles(id, nombre, slug))')
      .eq('obra_id', obraData.id)
      .order('anio', { ascending: false });
    if (prodData) setProducciones(prodData as unknown as ProduccionConReparto[]);

    const { data: fotosData } = await supabase
      .from('obra_fotos')
      .select('*')
      .eq('obra_id', obraData.id)
      .order('orden');
    if (fotosData) setFotos(fotosData);

    const { data: videosData } = await supabase
      .from('obra_videos')
      .select('*')
      .eq('obra_id', obraData.id)
      .order('orden');
    if (videosData) setVideos(videosData);

    setCargando(false);
  }

  if (cargando) {
    return (
      <div className="px-6 py-12 max-w-6xl mx-auto">
        <p className="text-ink/60 italic">Cargando ficha…</p>
      </div>
    );
  }

  if (noEncontrada || !obra) {
    return (
      <div className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-4">Obra no encontrada</h1>
        <Link to="/obras" className="text-carmin font-bold border-b-2 border-carmin">
          ← Volver al repertorio
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={obra.titulo}
        description={obra.sinopsis ?? undefined}
        image={obra.foto_portada_url ?? undefined}
        type="article"
      />

      {/* Migas de pan */}
      <div className="px-6 py-3 border-b-2 border-ink bg-paper">
        <div className="max-w-6xl mx-auto font-mono text-[11px] tracking-wider uppercase text-ink">
          <Link to="/" className="hover:text-carmin">Compañía</Link>
          <span className="mx-2">/</span>
          <Link to="/obras" className="hover:text-carmin">Obras</Link>
          <span className="mx-2">/</span>
          <span className="text-carmin">{obra.titulo}</span>
        </div>
      </div>

      {/* Cabecera */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <SectionRule className="mb-3">Repertorio · {obra.anio_estreno ?? '—'}</SectionRule>

          <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <div>
              <h1 className="font-serif text-5xl sm:text-6xl font-bold leading-[0.95] tracking-tight text-ink mb-2">
                {obra.titulo}
              </h1>
              {obra.autor && (
                <p className="font-serif italic text-ink/70 text-lg mb-7">— de {obra.autor}</p>
              )}

              {/* Ficha técnica como programa de mano */}
              <div className="border-y-2 border-ink py-4 grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-x-4 gap-y-2.5 sm:gap-y-2.5 text-sm">
                {director && (
                  <>
                    <span className="font-mono text-[10px] opacity-60 tracking-wider uppercase sm:self-center">Dirección</span>
                    <Link to={`/equipo/${director.slug}`} className="font-semibold text-ink no-underline hover:text-carmin">
                      {director.nombre}
                    </Link>
                  </>
                )}
                {obra.duracion_minutos && (
                  <>
                    <span className="font-mono text-[10px] opacity-60 tracking-wider uppercase sm:self-center mt-2 sm:mt-0">Duración</span>
                    <span className="text-ink">{obra.duracion_minutos} min</span>
                  </>
                )}
                {obra.anio_estreno && (
                  <>
                    <span className="font-mono text-[10px] opacity-60 tracking-wider uppercase sm:self-center mt-2 sm:mt-0">Estreno</span>
                    <span className="text-ink">{obra.anio_estreno}</span>
                  </>
                )}
                <span className="font-mono text-[10px] opacity-60 tracking-wider uppercase sm:self-center mt-2 sm:mt-0">Estado</span>
                <span>
                  <Tag variant={obra.estado === 'en_cartel' ? 'carmin' : 'paper'}>
                    {ESTADO_LABELS[obra.estado]}
                  </Tag>
                </span>
              </div>
            </div>

            <div
              className="aspect-[3/4] bg-ink border-2 border-ink shadow-brut-carmin-lg flex items-center justify-center text-paper/40 font-mono text-xs tracking-widest overflow-hidden"
              style={{ transform: 'rotate(1.2deg)' }}
            >
              {obra.foto_portada_url ? (
                <img src={obra.foto_portada_url} alt={obra.titulo} className="w-full h-full object-cover" />
              ) : (
                'FOTO PORTADA'
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sinopsis */}
      {obra.sinopsis && (
        <section className="px-6 py-10 border-t-2 border-ink">
          <div className="max-w-6xl mx-auto">
            <SectionRule className="mb-4">Sinopsis</SectionRule>
            <p className="font-serif italic text-xl leading-relaxed text-ink max-w-3xl">"{obra.sinopsis}"</p>
          </div>
        </section>
      )}

      {/* Producciones */}
      {producciones.length > 0 && (
        <section className="px-6 py-12 border-t-2 border-ink">
          <div className="max-w-6xl mx-auto">
            <SectionRule className="mb-6">Producciones</SectionRule>
            <div className="space-y-4">
              {producciones.map((prod, i) => (
                <Card key={prod.id} tilt={i % 2 === 0 ? -0.3 : 0.3} className="p-6">
                  <div className="flex justify-between items-baseline mb-4 pb-3 border-b border-dashed border-ink">
                    <div>
                      <p className="font-mono text-[10px] tracking-wider opacity-70">Nº {String(i + 1).padStart(2, '0')}</p>
                      <h3 className="font-serif text-2xl font-bold text-ink">{prod.temporada}</h3>
                      {prod.director && (
                        <p className="font-serif italic text-sm text-ink/70 mt-1">
                          Dirige:{' '}
                          <Link to={`/equipo/${prod.director.slug}`} className="text-ink no-underline hover:text-carmin">
                            {prod.director.nombre}
                          </Link>
                        </p>
                      )}
                    </div>
                    <Tag variant={prod.estado === 'en_cartel' ? 'carmin' : 'paper'}>{ESTADO_LABELS[prod.estado]}</Tag>
                  </div>

                  {prod.reparto.length > 0 && (
                    <>
                      <p className="font-mono text-[10px] opacity-60 tracking-wider uppercase mb-3">Reparto</p>
                      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                        {prod.reparto.map((r) => (
                          <div key={r.id} className="flex justify-between py-1.5 border-b border-ink/20">
                            <span className="font-serif italic text-ink">{r.personaje}</span>
                            {r.profile ? (
                              <Link
                                to={`/equipo/${r.profile.slug}`}
                                className="text-ink font-semibold border-b-2 border-carmin no-underline hover:bg-carmin hover:text-paper transition-colors"
                              >
                                {r.profile.nombre}
                              </Link>
                            ) : (
                              <span className="text-ink/60 italic">—</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Galería */}
      {fotos.length > 0 && (
        <section className="px-6 py-12 border-t-2 border-ink">
          <div className="max-w-6xl mx-auto">
            <SectionRule className="mb-6">Galería</SectionRule>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {fotos.map((foto, i) => (
                <div
                  key={foto.id}
                  className="aspect-square bg-ink border-2 border-ink shadow-brut-carmin overflow-hidden"
                  style={{ transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}
                >
                  <img src={foto.url} alt={foto.pie ?? ''} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section className="px-6 py-12 border-t-2 border-ink">
          <div className="max-w-6xl mx-auto">
            <SectionRule className="mb-6">Video</SectionRule>
            <div className="space-y-6">
              {videos.map((video) => (
                <div key={video.id} className="aspect-video border-2 border-ink shadow-brut-carmin-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtube_id}`}
                    title={video.titulo ?? obra.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
