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
              La Compañía Teatral Hubert de Blanck fue fundada en el año 1991 por un grupo de creadores provenientes de la desaparecida y emblemática agrupación Teatro Estudio
              . Desde sus inicios, la compañía ha buscado mantener una línea de trabajo sostenida, defendiendo el teatro como un ejercicio colectivo y continuo
              . Sobre sus tablas cobran vida puestas en escena de lo más variadas, abarcando desde la dramaturgia cubana hasta grandes clásicos del teatro universal
              . La historia de la agrupación está íntimamente vinculada a su sede en la barriada del Vedado, la cual fue inaugurada en 1955 en la planta alta de lo que antiguamente fuera el Conservatorio Nacional de Música, fundado por el propio músico holandés Hubert de Blanck
              . Gracias a esta herencia, el teatro se ha consolidado como un baluarte cultural vital para La Habana, brindando importantes servicios y enriqueciendo el alma de la ciudad
            </p>

            <p>
              Fieles a su filosofía de concebir el arte escénico como un quehacer ininterrumpido
              , la trayectoria del grupo ha estado marcada por nombres imprescindibles de la cultura nacional. Liderada por su directora general Orietta Medina, la compañía ha contado con creadores de la talla de los Premios Nacionales de Teatro Abelardo Estorino y Berta Martínez, y con interpretaciones memorables de actores como Pancho García, Adria Santana, Mirta Ibarra entre otros.
              . A lo largo de sus más de treinta años, han logrado importantes hitos: la producción de más de cien puestas en escena, giras dentro y fuera de Cuba, y la obtención de múltiples premios (como el Premio ACE y el Premio de la Crítica) por sus diseños, bandas sonoras y montajes
              . Asimismo, la sala teatral posee un valor incalculable como espacio de encuentro, ya que no solo alberga a la compañía, sino que acoge eventos como el Festival Internacional de Teatro de La Habana, presentaciones de elencos internacionales y exitosas temporadas de agrupaciones invitadas como Argos Teatro
            </p>

            <p>
              Hoy, la Hubert de Blanck mantiene vivo su repertorio bajo el hermoso principio de que el arte se engrandece haciéndolo sobre el escenario
              . Te invitamos a cruzar las puertas de este acogedor recinto de pequeño formato para disfrutar de nuestra programación permanente, que incluye emocionantes funciones nocturnas cada fin de semana y espacios dedicados al público infantil los domingos
              . Súmate a este proyecto, acompáñanos desde las butacas, colabora con nuestro ejercicio colectivo y conviértete en parte fundamental de la magia y la historia del teatro cubano
            </p>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-ink grid sm:grid-cols-2 gap-6">
            <div>
              <p className="font-mono text-[10px] opacity-60 tracking-wider uppercase mb-2">Dirección</p>
              <p className="text-ink">Calle calzada e/ A y B, Vedado<br />{COMPANIA.ciudad}, {COMPANIA.pais}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] opacity-60 tracking-wider uppercase mb-2">Contacto</p>
              <p className="text-ink">
                huberteatro@gmail.com<br />
                [teléfono]
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
