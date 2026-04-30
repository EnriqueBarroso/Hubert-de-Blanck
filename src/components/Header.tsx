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
            className="font-serif text-lg sm:text-2xl font-bold text-ink leading-none tracking-tight no-underline"
          >
            [ {COMPANIA.nombre} ]
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
                    `py-3 border-b border-dashed border-ink font-serif text-2xl ${
                      isActive ? 'text-carmin' : 'text-ink'
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
