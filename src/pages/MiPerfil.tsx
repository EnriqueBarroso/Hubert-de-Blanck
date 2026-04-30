import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import SEO from '../components/SEO';
import SectionRule from '../components/SectionRule';
import Card from '../components/Card';
import ImageUpload from '../components/ImageUpload';
import MisObras from '../components/MisObras';
import { supabase, isAdmin } from '../lib/supabase';
import { slugify } from '../lib/slug';
import type { Profile } from '../types/database';

export default function MiPerfil() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Campos editables
  const [nombre, setNombre] = useState('');
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [emailContacto, setEmailContacto] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [facebook, setFacebook] = useState('');

  useEffect(() => {
    void cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cargar() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    // Si el usuario es admin, su sitio es /admin (cubre flujo OAuth de Google).
    if (isAdmin(user.email)) {
      navigate('/admin', { replace: true });
      return;
    }

    let { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    // Fallback: si no existe ficha (trigger no disparó por alguna razón), crearla.
    if (!data) {
      const nombreInicial =
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        (user.email ? capitalizar(user.email.split('@')[0].replace(/\./g, ' ')) : 'Miembro');

      const slugBase = slugify(nombreInicial) || `miembro-${user.id.slice(0, 8)}`;
      const slugUnico = await encontrarSlugLibre(slugBase);

      const { data: creado, error: errInsert } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          nombre: nombreInicial,
          slug: slugUnico,
          tipo: 'actor',
          nivel: 'colaborador',
          activo: false,
        })
        .select()
        .single();

      if (errInsert) {
        setError(`No pudimos crear tu ficha: ${errInsert.message}`);
        setCargando(false);
        return;
      }
      data = creado;
    }

    setProfile(data);
    setNombre(data.nombre);
    setFotoUrl(data.foto_url);
    setBio(data.bio ?? '');
    setCiudad(data.ciudad ?? '');
    setEmailContacto(data.email_contacto ?? '');
    setInstagram(data.instagram ?? '');
    setYoutube(data.youtube ?? '');
    setFacebook(data.facebook ?? '');

    setCargando(false);
  }

  async function encontrarSlugLibre(base: string): Promise<string> {
    let candidato = base;
    let n = 0;
    // Como mucho 50 intentos: suficiente para colisiones reales y evita bucle infinito.
    while (n < 50) {
      const { data } = await supabase.from('profiles').select('id').eq('slug', candidato).maybeSingle();
      if (!data) return candidato;
      n += 1;
      candidato = `${base}-${n}`;
    }
    return `${base}-${Date.now()}`;
  }

  function capitalizar(texto: string): string {
    return texto
      .split(' ')
      .map((p) => (p.length > 0 ? p[0].toUpperCase() + p.slice(1).toLowerCase() : p))
      .join(' ');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    if (!nombre.trim()) {
      setError('El nombre no puede estar vacío.');
      return;
    }
    setGuardando(true);
    setMensaje(null);
    setError(null);

    // Si cambia el nombre y el slug actual era derivado del nombre original, regenerar slug.
    // Para no romper enlaces existentes, solo regeneramos el slug si la ficha aún no se ha publicado (activo = false).
    let slugFinal = profile.slug;
    if (!profile.activo && profile.nombre !== nombre.trim()) {
      const slugBase = slugify(nombre.trim()) || `miembro-${profile.id.slice(0, 8)}`;
      slugFinal = await encontrarSlugLibre(slugBase);
    }

    const { error: errUpd } = await supabase
      .from('profiles')
      .update({
        nombre: nombre.trim(),
        slug: slugFinal,
        foto_url: fotoUrl,
        bio: bio || null,
        ciudad: ciudad || null,
        email_contacto: emailContacto || null,
        instagram: instagram || null,
        youtube: youtube || null,
        facebook: facebook || null,
      })
      .eq('id', profile.id);

    setGuardando(false);

    if (errUpd) {
      setError(errUpd.message);
      return;
    }

    setMensaje('Cambios guardados.');
    // Refrescar la ficha local con los nuevos valores
    setProfile({ ...profile, nombre: nombre.trim(), slug: slugFinal, foto_url: fotoUrl });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/');
  }

  if (cargando) {
    return (
      <div className="px-6 py-12 max-w-3xl mx-auto">
        <p className="text-ink/60 italic">Cargando…</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="px-6 py-12 max-w-3xl mx-auto">
        <h1 className="font-serif text-2xl text-ink mb-4">Error</h1>
        <p className="text-ink/70">{error}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <SEO title="Mi perfil" />

      {/* Banda de zona privada */}
      <div className="bg-ink text-paper px-4 sm:px-6 py-1.5 flex justify-between items-center font-mono text-[10px] tracking-widest uppercase">
        <span>★ Zona privada ★</span>
        <span className="hidden sm:inline">{profile.nombre} · sesión abierta</span>
        <button onClick={handleSignOut} className="hover:text-carmin">Salir →</button>
      </div>

      <div className="px-4 sm:px-6 py-3 border-b-2 border-ink bg-paper">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <span className="font-mono text-[11px] tracking-wider uppercase text-ink">Mi perfil · editar</span>
          {profile.activo ? (
            <Link to={`/equipo/${profile.slug}`} className="font-mono text-[11px] tracking-wider uppercase text-carmin no-underline">
              Ver mi perfil público →
            </Link>
          ) : (
            <span className="font-mono text-[11px] tracking-wider uppercase text-ink/50">No visible aún</span>
          )}
        </div>
      </div>

      <section className="px-4 sm:px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <SectionRule className="mb-3">Editar ficha</SectionRule>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight text-ink mb-2">
            Tu camerino <span className="text-carmin italic">digital</span>
          </h1>
          <p className="font-serif italic text-ink/70 mb-8 max-w-xl">
            Los cambios se guardan al instante. Tu trayectoria en obras la gestiona la dirección — no podrás editarla aquí.
          </p>

          {/* Aviso de pendiente */}
          {!profile.activo && (
            <div className="bg-paper-2 border-2 border-ink shadow-brut-carmin p-4 mb-6 flex gap-3 items-start">
              <Clock size={20} className="text-carmin flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-ink mb-1">Tu ficha está pendiente de revisión</p>
                <p className="text-sm text-ink/75 leading-relaxed">
                  Aún no aparece en la sección pública del equipo. Completa tus datos y la dirección
                  la revisará y publicará cuando esté lista.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Retrato */}
            <Card tilt={-0.4} className="p-6">
              <SectionRule className="mb-5">Retrato principal</SectionRule>
              <ImageUpload
                valor={fotoUrl}
                onCambio={setFotoUrl}
                carpeta={`profiles/${profile.id}`}
                aspecto="retrato"
                label="Subir retrato"
              />
            </Card>

            {/* Datos básicos */}
            <Card tilt={0.3} className="p-6">
              <SectionRule className="mb-5">Datos básicos</SectionRule>

              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] opacity-60 tracking-wider uppercase mb-1.5">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="input-brut"
                    required
                  />
                  {profile.activo && (
                    <p className="text-[11px] text-ink/50 mt-1 italic">
                      Tu ficha ya está publicada. Si cambias el nombre, la URL pública seguirá siendo la misma.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] opacity-60 tracking-wider uppercase mb-1.5">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    className="input-brut"
                    placeholder="La Habana"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="font-mono text-[10px] opacity-60 tracking-wider uppercase">Biografía</label>
                    <span className="font-mono text-[10px] opacity-60">{bio.length} / 400</span>
                  </div>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 400))}
                    rows={4}
                    className="input-brut font-serif italic"
                    placeholder="Una breve biografía sobre ti…"
                  />
                </div>
              </div>
            </Card>

            {/* Redes y contacto */}
            <Card tilt={-0.2} className="p-6">
              <SectionRule className="mb-5">Redes y contacto</SectionRule>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] opacity-60 tracking-wider uppercase mb-1.5">Instagram</label>
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="input-brut"
                    placeholder="https://instagram.com/…"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] opacity-60 tracking-wider uppercase mb-1.5">YouTube</label>
                  <input
                    type="url"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    className="input-brut"
                    placeholder="https://youtube.com/…"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] opacity-60 tracking-wider uppercase mb-1.5">Facebook</label>
                  <input
                    type="url"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="input-brut"
                    placeholder="https://facebook.com/…"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] opacity-60 tracking-wider uppercase mb-1.5">Email de contacto</label>
                  <input
                    type="email"
                    value={emailContacto}
                    onChange={(e) => setEmailContacto(e.target.value)}
                    className="input-brut"
                    placeholder="contacto@ejemplo.com"
                  />
                </div>
              </div>
            </Card>

            {error && (
              <div className="bg-carmin text-paper px-4 py-3 text-sm font-semibold">{error}</div>
            )}

            {/* Banda de guardar */}
            <div className="bg-ink text-paper px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-stretch sm:items-center">
              <span className="font-mono text-[11px] tracking-wider uppercase opacity-70 text-center sm:text-left">
                {mensaje ?? 'Cambios sin guardar'}
              </span>
              <button
                type="submit"
                disabled={guardando}
                className="bg-carmin text-paper px-7 py-3 font-bold text-xs tracking-widest border-2 border-paper shadow-[4px_4px_0_0_#F2EBDA] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#F2EBDA] transition-all disabled:opacity-50"
              >
                {guardando ? 'Guardando…' : 'Guardar cambios →'}
              </button>
            </div>
          </form>

          {/* Sección Mis obras (separada del formulario de perfil) */}
          <div className="mt-8">
            <MisObras profileId={profile.id} />
          </div>
        </div>
      </section>
    </>
  );
}
