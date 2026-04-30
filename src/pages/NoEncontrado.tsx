import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NoEncontrado() {
  return (
    <>
      <SEO title="No encontrado" />
      <section className="px-6 py-24">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-mono text-[10px] tracking-widest text-carmin uppercase mb-4">Telón cerrado</p>
          <h1 className="font-serif text-7xl font-bold text-ink mb-4">404</h1>
          <p className="font-serif italic text-xl text-ink/70 mb-8">
            La página que buscas no existe o ha sido movida.
          </p>
          <Link to="/" className="text-carmin font-bold border-b-2 border-carmin pb-1 uppercase tracking-widest text-sm">
            Volver al inicio →
          </Link>
        </div>
      </section>
    </>
  );
}
