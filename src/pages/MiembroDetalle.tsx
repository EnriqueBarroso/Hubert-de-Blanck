import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionRule from '../components/SectionRule';
import Tag from '../components/Tag';
import { supabase } from '../lib/supabase';
import { TIPO_LABELS, NIVEL_LABELS } from '../lib/constants';
import type { Profile, ProfileFoto } from '../types/database';

interface FilaTrayectoria {
  produccion_id: string;
  obra_titulo: string;
  obra_slug: string;
  anio: number;
  personaje: string;
  director_nombre: string | null;
  director_slug: string | null;
}

export default function MiembroDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const [miembro, setMiembro] = useState<Profile | null>(null);
  const [trayectoria, setTrayectoria] = useState<FilaTrayectoria[]>([]);
  const [fotos, setFotos] = useState<ProfileFoto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [noEncontrado, setNoEncontrado] = useState(false);

  useEffect(() => {
    if (!slug) return;
    void cargar(slug);
  }, [slug]);

  async function cargar(slugMiembro: string) {
    setCargando(true);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slugMiembro)
      .maybeSingle();

    if (!profile) {
      setNoEncontrado(true);
      setCargando(false);
      return;
    }
    setMiembro(profile);

    // Trayectoria: reparto -> producciones -> obras (+ director)
    const { data: trayData } = await supabase
      .from('reparto')
      .select(
        `personaje,
         produccion:producciones(
           id, anio,
           obra:obras(titulo, slug),
           director:profiles!producciones_director_id_fkey(nombre, slug)
         )`,
      )
      .eq('profile_id', profile.id);

    if (trayData) {
      type RawRow = {
        personaje: string;
        produccion: {
          id: string;
          anio: number;
          obra: { titulo: string; slug: string } | null;
          director: { nombre: string; slug: string } | null;
        } | null;
      };

      const filas: FilaTrayectoria[] = (trayData as unknown as RawRow[])
        .filter((r) => r.produccion && r.produccion.obra)
        .map((r) => ({
          produccion_id: r.produccion!.id,
          obra_titulo: r.produccion!.obra!.titulo,
          obra_slug: r.produccion!.obra!.slug,
          anio: r.produccion!.anio,
          personaje: r.personaje,
          director_nombre: r.produccion!.director?.nombre ?? null,
          director_slug: r.produccion!.director?.slug ?? null,
        }))
        .sort((a, b) => b.anio - a.anio);
      setTrayectoria(filas);
    }

    const { data: fotosData } = await supabase
      .from('profile_fotos')
      .select('*')
      .eq('profile_id', profile.id)
      .order('orden');
    if (fotosData) setFotos(fotosData);

    setCargando(false);
  }

  if (cargando) {
    return (
      <div className="px-6 py-12 max-w-6xl mx-auto">
        <p className="text-ink/60 italic">Cargando ficha…</p>
      </div>
    );
  }

  if (noEncontrado || !miembro) {
    return (
      <div className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-4">Miembro no encontrado</h1>
        <Link to="/equipo" className="text-carmin font-bold border-b-2 border-carmin">
          ← Volver al equipo
        </Link>
      </div>
    );
  }

  // Separar nombre y apellido para el efecto tipográfico de cabecera
  const partes = miembro.nombre.trim().split(' ');
  const nombrePila = partes.slice(0, Math.ceil(partes.length / 2)).join(' ');
  const apellido = partes.slice(Math.ceil(partes.length / 2)).join(' ');

  return (
    <>
      <SEO title={miembro.nombre} description={miembro.bio ?? undefined} type="profile" image={miembro.foto_url ?? undefined} />

      <div className="px-6 py-3 border-b-2 border-ink bg-paper">
        <div className="max-w-6xl mx-auto font-mono text-[11px] tracking-wider uppercase text-ink">
          <Link to="/" className="hover:text-carmin">Compañía</Link>
          <span className="mx-2">/</span>
          <Link to="/equipo" className="hover:text-carmin">Equipo</Link>
          <span className="mx-2">/</span>
          <span className="text-carmin">{miembro.nombre}</span>
        </div>
      </div>

      {/* Cabecera */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[280px_1fr] gap-8 items-start">
          <div
            className="aspect-[3/4] bg-ink border-2 border-ink shadow-brut-carmin-lg flex items-center justify-center text-paper/40 font-mono text-xs tracking-widest overflow-hidden relative"
            style={{ transform: 'rotate(-1.5deg)' }}
          >
            {miembro.foto_url ? (
              <img src={miembro.foto_url} alt={miembro.nombre} className="w-full h-full object-cover" />
            ) : (
              'RETRATO'
            )}
            <div className="absolute -right-2 bottom-3" style={{ transform: 'rotate(3deg)' }}>
              <Tag variant={miembro.nivel === 'nucleo' ? 'carmin' : 'ink'}>
                {NIVEL_LABELS[miembro.nivel]}
              </Tag>
            </div>
          </div>

          <div>
            <SectionRule className="mb-3">{TIPO_LABELS[miembro.tipo]}</SectionRule>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold leading-[0.95] tracking-tight text-ink mb-6">
              {nombrePila}
              {apellido && (
                <>
                  <br />
                  <span className="text-carmin italic">{apellido}</span>
                </>
              )}
            </h1>
            {miembro.bio && (
              <p className="font-serif italic text-ink text-lg leading-relaxed max-w-xl mb-7">
                "{miembro.bio}"
              </p>
            )}

            {(miembro.instagram || miembro.youtube || miembro.facebook || miembro.email_contacto) && (
              <div className="flex gap-2 flex-wrap pt-4 border-t-2 border-ink">
                {miembro.instagram && (
                  <a href={miembro.instagram} target="_blank" rel="noreferrer" className="no-underline">
                    <Tag>@ Instagram →</Tag>
                  </a>
                )}
                {miembro.youtube && (
                  <a href={miembro.youtube} target="_blank" rel="noreferrer" className="no-underline">
                    <Tag>YouTube →</Tag>
                  </a>
                )}
                {miembro.facebook && (
                  <a href={miembro.facebook} target="_blank" rel="noreferrer" className="no-underline">
                    <Tag>Facebook →</Tag>
                  </a>
                )}
                {miembro.email_contacto && (
                  <a href={`mailto:${miembro.email_contacto}`} className="no-underline">
                    <Tag>Contacto →</Tag>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trayectoria */}
      {trayectoria.length > 0 && (
        <section className="px-6 py-12 border-t-2 border-ink">
          <div className="max-w-6xl mx-auto">
            <SectionRule className="mb-6">Trayectoria en la compañía</SectionRule>

            {/* Cabecera tabla — solo desktop */}
            <div className="hidden md:grid grid-cols-[60px_1.4fr_1fr_1fr] gap-4 pb-3 border-b-2 border-ink font-mono text-[10px] tracking-wider uppercase opacity-60">
              <span>Año</span>
              <span>Obra</span>
              <span>Personaje</span>
              <span>Dirige</span>
            </div>

            {trayectoria.map((fila) => (
              <div key={fila.produccion_id} className="border-b border-dashed border-ink py-4">
                {/* Vista móvil: apilada */}
                <div className="md:hidden">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-mono text-carmin font-bold text-lg">{fila.anio}</span>
                    <Link
                      to={`/obras/${fila.obra_slug}`}
                      className="font-serif text-xl italic font-bold text-ink no-underline hover:text-carmin leading-tight"
                    >
                      {fila.obra_titulo}
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm pl-1">
                    <span className="text-ink border-b-2 border-carmin inline-block pb-0.5">
                      {fila.personaje}
                    </span>
                    {fila.director_nombre && fila.director_slug && (
                      <span className="text-ink/60">
                        · dirige{' '}
                        <Link to={`/equipo/${fila.director_slug}`} className="text-ink/75 no-underline hover:text-carmin">
                          {fila.director_nombre}
                        </Link>
                      </span>
                    )}
                  </div>
                </div>

                {/* Vista desktop: tabla */}
                <div className="hidden md:grid grid-cols-[60px_1.4fr_1fr_1fr] gap-4 items-baseline">
                  <span className="font-mono text-carmin font-bold">{fila.anio}</span>
                  <Link
                    to={`/obras/${fila.obra_slug}`}
                    className="font-serif text-lg italic font-bold text-ink no-underline hover:text-carmin"
                  >
                    {fila.obra_titulo}
                  </Link>
                  <span className="text-ink border-b-2 border-carmin self-start inline-block pb-0.5">
                    {fila.personaje}
                  </span>
                  {fila.director_nombre && fila.director_slug ? (
                    <Link to={`/equipo/${fila.director_slug}`} className="text-sm text-ink/75 no-underline hover:text-carmin">
                      {fila.director_nombre}
                    </Link>
                  ) : (
                    <span className="text-sm text-ink/40">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Galería personal */}
      {fotos.length > 0 && (
        <section className="px-6 py-12 border-t-2 border-ink">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-baseline mb-6">
              <SectionRule>Galería personal</SectionRule>
              <span className="font-mono text-[10px] opacity-60 tracking-wider uppercase">
                {String(fotos.length).padStart(2, '0')} imágenes
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {fotos.map((foto, i) => (
                <div
                  key={foto.id}
                  className="aspect-[3/4] bg-ink border-2 border-ink shadow-brut-carmin overflow-hidden"
                  style={{ transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}
                >
                  <img src={foto.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
