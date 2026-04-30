import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionRule from '../components/SectionRule';
import Button from '../components/Button';
import { supabase, isAdmin } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [cargandoGoogle, setCargandoGoogle] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    setCargando(false);

    if (authError) {
      setError('Credenciales incorrectas. Revisa email y contraseña.');
      return;
    }
    navigate(isAdmin(email) ? '/admin' : '/mi-perfil');
  }

  async function handleGoogle() {
    setError(null);
    setCargandoGoogle(true);

    // Tras la vuelta de Google, Supabase nos devuelve a /mi-perfil.
    // Si el email autenticado coincide con el admin, MiPerfil hará la redirección a /admin.
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/mi-perfil`,
      },
    });

    if (oauthError) {
      setError(`No se pudo iniciar sesión con Google: ${oauthError.message}`);
      setCargandoGoogle(false);
    }
    // Si todo va bien, el navegador redirige a Google y nunca llegamos aquí.
  }

  return (
    <>
      <SEO title="Acceso" description="Acceso al panel personal de los miembros de la compañía." />

      <section className="px-6 py-16">
        <div className="max-w-md mx-auto">
          <SectionRule className="mb-3">Zona privada</SectionRule>
          <h1 className="font-serif text-4xl font-bold text-ink mb-2 leading-tight">
            Tu <span className="text-carmin italic">camerino</span>
          </h1>
          <p className="font-serif italic text-ink/70 mb-8">
            Accede para editar tu ficha de miembro.
          </p>

          {/* Botón Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={cargandoGoogle}
            className="w-full bg-paper-2 text-ink border-2 border-ink shadow-brut hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brut-lg transition-all px-6 py-3 font-bold text-[12px] tracking-widest uppercase flex items-center justify-center gap-3 disabled:opacity-50 mb-6"
          >
            {/* Logo Google en SVG */}
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            {cargandoGoogle ? 'Conectando…' : 'Entrar con Google'}
          </button>

          {/* Separador */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-ink/20"></div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-ink/50">o con email</span>
            <div className="flex-1 h-px bg-ink/20"></div>
          </div>

          {/* Formulario email/password */}
          <form onSubmit={handleSubmit} className="bg-paper-2 border-2 border-ink shadow-brut p-6 space-y-4">
            <div>
              <label className="block font-mono text-[10px] opacity-60 tracking-wider uppercase mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-brut"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] opacity-60 tracking-wider uppercase mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-brut"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-carmin text-paper px-3 py-2 text-sm font-semibold">{error}</div>
            )}

            <Button type="submit" disabled={cargando}>
              {cargando ? 'Entrando…' : 'Entrar →'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-ink/60">
            ¿Aún no tienes cuenta? Pídele acceso a la dirección de la compañía.
          </p>
        </div>
      </section>
    </>
  );
}
