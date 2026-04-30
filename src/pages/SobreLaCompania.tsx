import SEO from '../components/SEO';
import SectionRule from '../components/SectionRule';
import { COMPANIA } from '../lib/constants';

export default function SobreLaCompania() {
  return (
    <>
      <SEO title="La sala" description="Historia de la compañía Hubert de Blanck y su sala en La Habana." />

      <section className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <SectionRule className="mb-3">La sala</SectionRule>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold leading-none tracking-tight text-ink mb-2">
            {COMPANIA.nombre}
          </h1>
          <p className="font-serif italic text-ink/70 text-lg mb-10">— compañía y sede</p>

          <div className="prose prose-lg font-serif text-ink space-y-5">
            <p className="font-serif italic text-2xl leading-snug text-ink">
              "Compañía y sede a la vez. Hacemos teatro y abrimos la sala a quienes comparten el oficio."
            </p>

            <p>
              [Aquí irá la historia de la compañía. Habla de cuándo se fundó, qué buscan, qué tipo de
              teatro hacen, cuál es su relación con el conservatorio y con la ciudad.]
            </p>

            <p>
              [Continúa con su filosofía artística, los nombres clave en su trayectoria, los hitos
              importantes — premios, giras, colaboraciones — y la importancia de la sala como espacio
              de encuentro.]
            </p>

            <p>
              [Cierra con una invitación: a ver una función, a colaborar, a sumarse al proyecto.]
            </p>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-ink grid sm:grid-cols-2 gap-6">
            <div>
              <p className="font-mono text-[10px] opacity-60 tracking-wider uppercase mb-2">Dirección</p>
              <p className="text-ink">[Dirección de la sala]<br />{COMPANIA.ciudad}, {COMPANIA.pais}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] opacity-60 tracking-wider uppercase mb-2">Contacto</p>
              <p className="text-ink">
                [email de contacto]<br />
                [teléfono]
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
