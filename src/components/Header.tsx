import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { COMPANIA } from '../lib/constants';
import { useAdmin } from '../lib/hooks/useAdmin';

const NAV_ITEMS = [
  { to: '/obras', label: 'Obras' },
  { to: '/equipo', label: 'Equipo' },
  { to: '/sobre-la-compania', label: 'Sala' },
];

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user, esAdmin } = useAdmin();

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    <>
      {/* Banda superior tipo "billete numerado" */}
      <div className="bg-ink text-paper px-4 sm:px-6 py-1.5 flex justify-between items-center font-mono text-[9px] sm:text-[10px] tracking-widest uppercase">
        <span>★ Temp 2026 ★</span>
        <span className="hidden sm:inline">Sala de la Habana · Cuba</span>
        <span>Nº 0042</span>
      </div>

      {/* Nav principal */}
      <header className="border-b-2 border-ink bg-paper relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-3">
          <Link
            to="/"
            onClick={cerrarMenu}
            className="flex items-center gap-3 group no-underline"
          >
            {/* El Logo Gráfico — Ahora sin fondo propio */}
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12">
              <img
                src="/logo_transparent.png"
                alt="Logo Hubert de Blanck"
                className="h-full w-full object-contain"
              />
            </div>

            {/* El Nombre */}
            <div className="flex flex-col justify-center">
              <h1 className="font-serif text-lg sm:text-2xl font-bold leading-[0.8] text-ink group-hover:text-carmin transition-colors uppercase m-0">
                Hubert de Blanck
              </h1>
              <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] uppercase opacity-50 mt-1">
                Compañía Teatral
              </span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex gap-5 text-[12px] font-semibold tracking-wider uppercase text-ink">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `pb-0.5 ${isActive ? 'border-b-2 border-carmin' : 'hover:border-b-2 hover:border-ink'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA derecha — desktop */}
          {esAdmin ? (
            <Link
              to="/admin"
              className="hidden md:inline-block bg-carmin text-paper border-[1.5px] border-ink px-3 py-1 text-[11px] tracking-widest font-semibold uppercase hover:shadow-brut-sm transition-shadow no-underline"
            >
              Panel admin →
            </Link>
          ) : user ? (
            <Link
              to="/mi-perfil"
              className="hidden md:inline-block bg-paper-2 text-ink border-[1.5px] border-ink px-3 py-1 text-[11px] tracking-widest font-semibold uppercase hover:shadow-brut-sm transition-shadow no-underline"
            >
              Mi perfil →
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-block bg-paper-2 text-ink border-[1.5px] border-ink px-3 py-1 text-[11px] tracking-widest font-semibold uppercase hover:shadow-brut-sm transition-shadow no-underline"
            >
              Entrar →
            </Link>
          )}

          {/* Hamburguesa móvil */}
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            className="md:hidden border-[1.5px] border-ink p-1.5 hover:shadow-brut-sm transition-shadow"
          >
            {menuAbierto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Drawer móvil */}
        {menuAbierto && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-paper border-b-2 border-ink shadow-brut z-50">
            <nav className="px-4 py-4 flex flex-col">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={cerrarMenu}
                  className={({ isActive }) =>
                    `py-3 border-b border-dashed border-ink font-serif text-2xl ${isActive ? 'text-carmin' : 'text-ink'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {esAdmin ? (
                <Link
                  to="/admin"
                  onClick={cerrarMenu}
                  className="mt-4 bg-carmin text-paper px-4 py-3 font-bold text-[12px] tracking-widest uppercase text-center border-2 border-ink shadow-brut no-underline"
                >
                  Panel admin →
                </Link>
              ) : user ? (
                <Link
                  to="/mi-perfil"
                  onClick={cerrarMenu}
                  className="mt-4 bg-ink text-paper px-4 py-3 font-bold text-[12px] tracking-widest uppercase text-center border-2 border-ink shadow-brut-carmin no-underline"
                >
                  Mi perfil →
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={cerrarMenu}
                  className="mt-4 bg-ink text-paper px-4 py-3 font-bold text-[12px] tracking-widest uppercase text-center border-2 border-ink shadow-brut-carmin no-underline"
                >
                  Entrar →
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
