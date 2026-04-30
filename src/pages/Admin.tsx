import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, BookOpen, Image as ImageIcon, Inbox, LogOut } from 'lucide-react';
import SEO from '../components/SEO';
import AdminEquipo from '../components/admin/AdminEquipo';
import AdminObras from '../components/admin/AdminObras';
import AdminGalerias from '../components/admin/AdminGalerias';
import AdminPropuestas from '../components/admin/AdminPropuestas';
import { useAdmin } from '../lib/hooks/useAdmin';
import { supabase } from '../lib/supabase';

type Tab = 'equipo' | 'obras' | 'galerias' | 'propuestas';

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'equipo', label: 'Equipo', icon: Users },
  { id: 'obras', label: 'Obras', icon: BookOpen },
  { id: 'galerias', label: 'Galerías', icon: ImageIcon },
  { id: 'propuestas', label: 'Propuestas', icon: Inbox },
];

export default function Admin() {
  const { user, esAdmin, cargando } = useAdmin();
  const [tab, setTab] = useState<Tab>('equipo');
  const [pendientes, setPendientes] = useState<number>(0);

  // Cargar contador de propuestas pendientes (refresca al cambiar de tab)
  useEffect(() => {
    if (!esAdmin) return;
    void (async () => {
      const { count } = await supabase
        .from('reparto_propuestas')
        .select('id', { count: 'exact', head: true })
        .eq('estado', 'pendiente');
      setPendientes(count ?? 0);
    })();
  }, [esAdmin, tab]);

  if (cargando) {
    return (
      <div className="px-6 py-12 max-w-3xl mx-auto">
        <p className="text-ink/60 italic">Verificando acceso…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!esAdmin) return <Navigate to="/" replace />;

  async function salir() {
    await supabase.auth.signOut();
  }

  return (
    <>
      <SEO title="Panel admin" />

      {/* Banda superior — zona admin */}
      <div className="bg-carmin text-paper px-4 sm:px-6 py-1.5 flex justify-between items-center font-mono text-[10px] tracking-widest uppercase">
        <span>★ Panel admin ★</span>
        <span className="hidden sm:inline">{user.email}</span>
        <button onClick={salir} className="hover:underline flex items-center gap-1">
          <LogOut size={11} /> Salir
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b-2 border-ink bg-paper sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex">
          {TABS.map(({ id, label, icon: Icon }) => {
            const activa = tab === id;
            const conPendientes = id === 'propuestas' && pendientes > 0;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`relative flex-1 sm:flex-none px-4 sm:px-6 py-4 font-bold text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 border-b-[3px] transition-colors ${
                  activa
                    ? 'border-carmin text-ink'
                    : 'border-transparent text-ink/50 hover:text-ink'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label}</span>
                {conPendientes && (
                  <span className="absolute top-2 right-2 sm:right-3 bg-carmin text-paper text-[9px] font-bold px-1.5 py-0.5 leading-none border border-ink">
                    {pendientes}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido */}
      <section className="px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {tab === 'equipo' && <AdminEquipo />}
          {tab === 'obras' && <AdminObras />}
          {tab === 'galerias' && <AdminGalerias />}
          {tab === 'propuestas' && <AdminPropuestas />}
        </div>
      </section>
    </>
  );
}
