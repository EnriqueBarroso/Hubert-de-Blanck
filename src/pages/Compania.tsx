import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart, Lightbulb, Users, Globe, Sparkles, Quote, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CompanyGallery from "@/components/CompanyGallery";

// Imágenes estáticas
import teamPhoto from "@/assets/team-photo.jpg";
import history1 from "@/assets/history-1.jpg";
import history2 from "@/assets/history-2.jpg";
import theaterInterior from "@/assets/theater-interior.jpg";

const Compania = () => {
  const [teamPhotoUrl, setTeamPhotoUrl] = useState<string>(teamPhoto);

 useEffect(() => {
    const fetchTeamPhoto = async () => {
      try {
        // AÑADIDO: 'as any' al final de la cadena para saltarse el chequeo estricto de TypeScript
        const { data } = await supabase
          .from("gallery")
          .select("image_url, category")
          .or("category.eq.Equipo,category.eq.Ensayos")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle() as any; 

        if (data && data.image_url) {
          setTeamPhotoUrl(data.image_url);
        }
      } catch (error) {
        console.error("Error cargando foto de equipo:", error);
      }
    };
    fetchTeamPhoto();
  }, []);

  const values = [
    {
      icon: Lightbulb,
      title: "Innovación",
      description: "Exploramos constantemente nuevas formas de contar historias, fusionando tradición teatral con técnicas vanguardistas.",
    },
    {
      icon: Heart,
      title: "Pasión",
      description: "Cada producción nace del amor profundo por el arte teatral y el compromiso con la excelencia artística.",
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Creamos espacios de encuentro donde artistas y público se conectan a través de experiencias transformadoras.",
    },
    {
      icon: Globe,
      title: "Diversidad",
      description: "Celebramos la pluralidad de voces, historias y perspectivas que enriquecen nuestra escena cultural.",
    },
  ];

  const team = [
    {
      name: "Orietta Medina",
      role: "Directora General",
      bio: "Actriz y directora con una vasta trayectoria. Lidera la compañía integrando el legado de Teatro Estudio con nuevas búsquedas estéticas contemporáneas.",
    },
    {
      name: "Fabricio Hernández",
      role: "Director Artístico",
      bio: "Dramaturgo y director enfocado en la experimentación escénica y el diálogo con el público actual.",
    },
    {
      name: "Marcelo Sanoja",
      role: "Producción",
      bio: "Encargado de la logística y producción ejecutiva, asegurando que cada espectáculo llegue a escena con la mayor calidad.",
    },
    {
      name: "Equipo Técnico",
      role: "Luces y Sonido",
      bio: "Profesionales dedicados que construyen la atmósfera mágica de cada función desde la cabina y el escenario.",
    },
  ];

  const achievements = [
    {
      year: "2023",
      title: "Premio Nacional de Teatro",
      description: "Reconocimiento a la excelencia artística y trayectoria.",
    },
    {
      year: "2022",
      title: "Reconocimiento UNESCO",
      description: "Por contribución al desarrollo cultural sostenible.",
    },
    {
      year: "2021",
      title: "Festival Internacional",
      description: "Gran Premio del Jurado en el Festival de Teatro de Bogotá.",
    },
    {
      year: "2020",
      title: "Premio Villanueva",
      description: "De la crítica teatral a los mejores espectáculos del año.",
    },
  ];

  const milestones = [
    {
      year: "1955",
      title: "La Sala",
      description: "Se inaugura la sala Hubert de Blanck en el Vedado, un espacio que se convertiría en sede emblemática del teatro cubano.",
      image: history1,
    },
    {
      year: "1991",
      title: "Fundación de la Compañía",
      description: "Nace la Compañía Teatral Hubert de Blanck, derivada del legendario grupo Teatro Estudio, consolidando un perfil artístico propio.",
      image: history2,
    },
    {
      year: "2010",
      title: "Renovación",
      description: "Restauración capital del teatro y modernización técnica para acoger montajes de mayor complejidad.",
      image: theaterInterior,
    },
    {
      year: "2024",
      title: "Actualidad",
      description: "Un referente indiscutible de la escena cubana, manteniendo vivo el rigor artístico heredado de sus fundadores.",
      image: teamPhotoUrl,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-theater-darker via-background to-background z-0" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary opacity-10 -skew-x-12 transform translate-x-1/4" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <p className="font-outfit text-sm font-medium text-primary mb-4 tracking-widest uppercase flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Nuestra Historia
            </p>
            <h1 className="font-playfair text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Compañía Hubert de Blanck
            </h1>
            <p className="font-outfit text-xl text-muted-foreground leading-relaxed mb-8">
              Más de tres décadas de creación teatral ininterrumpida, defendiendo un teatro de arte, reflexivo y comprometido con su tiempo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/elenco">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-outfit">
                  Ver elenco
                </Button>
              </Link>
              <Link to="/producciones">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-outfit">
                  Ver producciones
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-theater-darker">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-playfair text-3xl font-bold text-foreground mb-4">
                  Nuestra Misión
                </h3>
                <p className="font-outfit text-muted-foreground leading-relaxed">
                  Producir espectáculos teatrales de alto nivel artístico que dialoguen con la realidad contemporánea, fomentando el pensamiento crítico y la sensibilidad estética en nuestro público.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                  <Lightbulb className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-playfair text-3xl font-bold text-foreground mb-4">
                  Nuestra Visión
                </h3>
                <p className="font-outfit text-muted-foreground leading-relaxed">
                  Mantenernos como un espacio de confluencia para artistas consagrados y nuevas generaciones, honrando nuestra herencia de Teatro Estudio mientras exploramos nuevos lenguajes escénicos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-6">
              Nuestros Valores
            </h2>
            <p className="font-outfit text-lg text-muted-foreground max-w-2xl mx-auto">
              Ética, rigor artístico y compromiso social
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary transition-colors group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-playfair text-xl font-bold text-foreground mb-3">
                    {value.title}
                  </h4>
                  <p className="font-outfit text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* NUEVA SECCIÓN: HISTORIA Y LEGADO */}
      <section className="py-20 bg-gradient-to-b from-background to-theater-darker">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Quote className="h-12 w-12 text-primary mx-auto mb-6 opacity-50" />
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
                Un Legado de Excelencia
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
            </div>

            <div className="space-y-8 font-outfit text-lg text-muted-foreground leading-relaxed text-justify md:px-8">
              <p>
                La <strong className="text-foreground">Compañía Teatral Hubert de Blanck</strong> ocupa un lugar privilegiado en la historia de las artes escénicas de Cuba. Fundada oficialmente en <strong className="text-foreground">1991</strong>, nuestra agrupación nació como una derivación natural y evolutiva del legendario grupo <strong>Teatro Estudio</strong>, herederos de una tradición de rigor artístico y compromiso social que marcó el siglo XX cubano.
              </p>
              <p>
                Bajo la dirección general de <strong className="text-foreground">Orietta Medina</strong>, hemos mantenido viva la llama de la experimentación, llevando a escena tanto clásicos universales como obras contemporáneas latinoamericanas. Nuestra sede, la emblemática sala Hubert de Blanck en el corazón del Vedado, no es solo un edificio; es un laboratorio creativo donde convergen maestros consagrados y jóvenes talentos para dialogar sobre la realidad humana a través del arte.
              </p>
              <p>
                Nos define la convicción de que el teatro es un espacio para el pensamiento crítico y la emoción estética. Más que representar obras, buscamos crear experiencias que resuenen en la memoria del espectador, honrando nuestro pasado mientras construimos el futuro de la escena nacional.
              </p>
            </div>
            <div className="pt-8 text-center">
              <Link to="/historia">
                <Button size="lg" variant="default" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-outfit px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explorar Nuestra Historia Completa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 bg-theater-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-6">
              Nuestra Trayectoria
            </h2>
            <p className="font-outfit text-lg text-muted-foreground max-w-2xl mx-auto">
              Desde la fundación de la sala hasta la consolidación de la compañía actual
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
              >
                <div className="lg:w-1/2">
                  <div className="relative overflow-hidden rounded-lg aspect-video border border-border/50 shadow-xl">
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="inline-block px-4 py-2 bg-primary/20 rounded-full mb-4">
                    <span className="font-outfit text-primary font-bold">{milestone.year}</span>
                  </div>
                  <h3 className="font-playfair text-3xl font-bold text-foreground mb-4">
                    {milestone.title}
                  </h3>
                  <p className="font-outfit text-muted-foreground leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-6">
              Dirección Artística
            </h2>
            <p className="font-outfit text-lg text-muted-foreground max-w-2xl mx-auto">
              Quienes guían el rumbo creativo de la compañía
            </p>
          </div>

          <div className="mb-12">
            <div className="relative overflow-hidden rounded-lg aspect-[21/9] max-w-5xl mx-auto shadow-2xl border border-border/30">
              <img
                src={teamPhotoUrl}
                alt="Equipo de la compañía Hubert de Blanck"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="font-playfair text-3xl font-bold mb-2">Elenco y Equipo Técnico</p>
                <p className="font-outfit text-white/80">La fuerza vital de cada producción</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary transition-colors h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <h4 className="font-playfair text-xl font-bold text-foreground mb-2">
                    {member.name}
                  </h4>
                  <p className="font-outfit text-sm text-primary mb-4 font-semibold uppercase tracking-wide border-b border-border pb-2">
                    {member.role}
                  </p>
                  <p className="font-outfit text-sm text-muted-foreground leading-relaxed flex-grow">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-theater-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-6">
              Reconocimientos
            </h2>
            <p className="font-outfit text-lg text-muted-foreground max-w-2xl mx-auto">
              Premios que celebran nuestro compromiso con la excelencia teatral
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => (
              <Card key={index} className="bg-card border-border hover:border-secondary transition-colors group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/30 transition-colors">
                      <Award className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-3">
                        <span className="font-outfit text-xs text-primary font-bold">{achievement.year}</span>
                      </div>
                      <h4 className="font-playfair text-xl font-bold text-foreground mb-2">
                        {achievement.title}
                      </h4>
                      <p className="font-outfit text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CompanyGallery />

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
              Forma Parte de Nuestra Historia
            </h2>
            <p className="font-outfit text-lg text-muted-foreground mb-8">
              Ya sea como espectador, estudiante o colaborador, hay un lugar para ti en nuestra comunidad teatral
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/cartelera">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-outfit">
                  Ver cartelera
                </Button>
              </Link>
              <Link to="/talleres">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-outfit">
                  Únete a nuestros talleres
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Compania;