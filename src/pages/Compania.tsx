import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart, Lightbulb, Users, Globe, Sparkles } from "lucide-react";

import teamPhoto from "@/assets/team-photo.jpg";
import history1 from "@/assets/history-1.jpg";
import history2 from "@/assets/history-2.jpg";
import theaterInterior from "@/assets/theater-interior.jpg";

const Compania = () => {
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
      name: "Ana Martínez",
      role: "Directora Artística",
      bio: "Más de 20 años revolucionando el teatro latinoamericano con su visión contemporánea.",
    },
    {
      name: "Carlos Rodríguez",
      role: "Director de Producción",
      bio: "Experto en montajes complejos con experiencia en teatros de todo el mundo.",
    },
    {
      name: "María González",
      role: "Coreógrafa Principal",
      bio: "Especialista en teatro musical con formación en Broadway y el West End.",
    },
    {
      name: "Luis Fernández",
      role: "Director Pedagógico",
      bio: "Lidera nuestros programas de formación con metodologías innovadoras.",
    },
  ];

  const achievements = [
    {
      year: "2023",
      title: "Premio Nacional de Teatro",
      description: "Mejor Producción del Año por 'La Casa de Bernarda Alba'",
    },
    {
      year: "2022",
      title: "Reconocimiento UNESCO",
      description: "Por contribución al desarrollo cultural sostenible",
    },
    {
      year: "2021",
      title: "Festival Internacional",
      description: "Gran Premio del Jurado en el Festival de Teatro de Bogotá",
    },
    {
      year: "2020",
      title: "Innovación Cultural",
      description: "Premio a la Excelencia en Teatro Digital durante la pandemia",
    },
  ];

  const milestones = [
    {
      year: "1955",
      title: "Fundación",
      description: "Nace la Compañía Hubert de Blanck como un espacio dedicado a la experimentación teatral.",
      image: history1,
    },
    {
      year: "1980",
      title: "Expansión Internacional",
      description: "Primera gira internacional que llevó nuestras producciones a Europa y América Latina.",
      image: history2,
    },
    {
      year: "2010",
      title: "Renovación del Espacio",
      description: "Modernización integral del teatro manteniendo su esencia histórica.",
      image: theaterInterior,
    },
    {
      year: "2024",
      title: "Nueva Era",
      description: "Consolidación como referente del teatro contemporáneo con enfoque en nuevas narrativas.",
      image: teamPhoto,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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
              Desde 1955, transformando la escena teatral cubana y latinoamericana con producciones 
              que desafían lo convencional y abrazan la vanguardia artística.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-outfit">
                Únete a nosotros
              </Button>
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
                  Crear experiencias teatrales transformadoras que desafíen percepciones, 
                  inspiren reflexión y celebren la diversidad cultural. Nos comprometemos a 
                  ser un espacio de excelencia artística donde el teatro contemporáneo y la 
                  tradición convergen para dar vida a historias que importan.
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
                  Ser el epicentro del teatro vanguardista en América Latina, reconocidos 
                  internacionalmente por nuestra audacia creativa, innovación escénica y 
                  compromiso con la formación de nuevas generaciones de artistas que llevarán 
                  el teatro hacia territorios inexplorados.
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
              Los pilares que guían cada decisión artística y cada producción que llevamos al escenario
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

      {/* History Timeline */}
      <section className="py-20 bg-theater-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-6">
              Nuestra Trayectoria
            </h2>
            <p className="font-outfit text-lg text-muted-foreground max-w-2xl mx-auto">
              70 años de historia teatral marcados por la innovación y la pasión artística
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="lg:w-1/2">
                  <div className="relative overflow-hidden rounded-lg aspect-video">
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
              Equipo Artístico
            </h2>
            <p className="font-outfit text-lg text-muted-foreground max-w-2xl mx-auto">
              Los visionarios que dan vida a nuestras producciones
            </p>
          </div>

          <div className="mb-12">
            <div className="relative overflow-hidden rounded-lg aspect-[21/9] max-w-5xl mx-auto">
              <img
                src={teamPhoto}
                alt="Equipo de la compañía"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <h4 className="font-playfair text-xl font-bold text-foreground mb-2">
                    {member.name}
                  </h4>
                  <p className="font-outfit text-sm text-primary mb-3 font-semibold">
                    {member.role}
                  </p>
                  <p className="font-outfit text-sm text-muted-foreground leading-relaxed">
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
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-outfit">
                Ver cartelera
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-outfit">
                Únete a nuestros talleres
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-theater-darker py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-playfair text-2xl font-bold tracking-wide mb-4">
                <span className="text-primary">Hubert</span>
                <span className="text-foreground"> de </span>
                <span className="text-secondary">Blanck</span>
              </div>
              <p className="font-outfit text-sm text-muted-foreground">
                Teatro contemporáneo y vanguardista
              </p>
            </div>
            <div>
              <h3 className="font-outfit font-bold text-foreground mb-4">Navegación</h3>
              <ul className="space-y-2 font-outfit text-sm text-muted-foreground">
                <li><a href="/" className="hover:text-primary transition-colors">Inicio</a></li>
                <li><a href="/cartelera" className="hover:text-primary transition-colors">Cartelera</a></li>
                <li><a href="/compania" className="hover:text-primary transition-colors">La Compañía</a></li>
                <li><a href="/blog" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-outfit font-bold text-foreground mb-4">Contacto</h3>
              <ul className="space-y-2 font-outfit text-sm text-muted-foreground">
                <li>info@hubertdeblanck.com</li>
                <li>+1 (555) 123-4567</li>
                <li>La Habana, Cuba</li>
              </ul>
            </div>
            <div>
              <h3 className="font-outfit font-bold text-foreground mb-4">Síguenos</h3>
              <ul className="space-y-2 font-outfit text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center font-outfit text-sm text-muted-foreground">
            <p>&copy; 2024 Compañía Hubert de Blanck. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Compania;
