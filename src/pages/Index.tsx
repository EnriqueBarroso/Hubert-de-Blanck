import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import venueGroove from "@/assets/venue-groove.jpg";

const Index = () => {
  const upcomingEvents = [
    {
      title: "101 Hip Hop Jam",
      date: "18 noviembre",
      image: event1,
      category: "Jam Session",
      categoryVariant: "session" as const,
    },
    {
      title: "YULIE",
      date: "18 noviembre",
      image: event2,
      category: "Marula Club",
      categoryVariant: "club" as const,
    },
    {
      title: "World Groove Session",
      date: "19 noviembre",
      image: event3,
      category: "Jam Session",
      categoryVariant: "session" as const,
    },
  ];

  const blogPosts = [
    {
      title: "Las bandas que comenzaron en salas pequeñas y ahora llenan estadios",
      image: event1,
      excerpt: "Descubre la historia de artistas que empezaron en venues íntimos como el nuestro",
    },
    {
      title: "Las mejores salas pequeñas de conciertos en Barcelona para descubrir música nueva",
      image: event2,
      excerpt: "Una guía completa de los espacios más auténticos de la ciudad",
    },
    {
      title: "Por qué los conciertos en salas pequeñas son la mejor forma de disfrutar del funk y el jazz",
      image: event3,
      excerpt: "La experiencia íntima que solo un venue pequeño puede ofrecer",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Events Section with Yellow Accent */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-96 bg-primary -skew-y-12 transform translate-y-32 opacity-100 z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {upcomingEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold rounded-full px-8"
            >
              Agenda completa
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* La Sala Section */}
      <section className="relative py-20 bg-venue-darker overflow-hidden">
        <div className="absolute bottom-0 left-0 w-1/2 h-96 bg-primary -skew-y-12 transform -translate-y-32 opacity-100 z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-primary mb-4 tracking-widest uppercase">
                La Sala
              </p>
              <h2 className="text-6xl font-bold text-foreground mb-6 leading-tight">
                El templo del Groove
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Aquí no venimos a contar cuentos, venimos a escribirlos en la pista. Trae tus ganas de quemar suela y déjate 
                sonidos que te harán sentir. Esto no es sólo una sala. Es tu próxima obsesión.
              </p>
              <Button 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Descubre más
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10 lg:block hidden" />
              <img
                src={venueGroove}
                alt="El templo del Groove"
                className="rounded-lg w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section with Orange Accent */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-96 bg-venue-coral -skew-y-12 transform translate-y-32 opacity-100 z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-foreground mb-6">
              Historias desde la pista
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Relatos, entrevistas y crónicas del mundo de la música en vivo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post, index) => (
              <BlogCard key={index} {...post} />
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold rounded-full px-8"
            >
              Ver todos los posts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-venue-darker py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold tracking-wider mb-4">
                <span className="text-foreground">MAR</span>
                <span className="text-primary">ULA</span>
              </div>
              <p className="text-sm text-muted-foreground">
                El templo del Groove en Barcelona
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">Navegación</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Inicio</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Agenda</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">La Sala</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>info@marula.club</li>
                <li>+34 123 456 789</li>
                <li>Barcelona, España</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-4">Síguenos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Marula. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
