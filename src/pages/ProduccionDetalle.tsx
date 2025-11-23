import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { plays } from "@/data/plays";
import { actors } from "@/data/actors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActorCard from "@/components/ActorCard";
import { Calendar, User, MapPin, Clock, ArrowLeft } from "lucide-react";

const ProduccionDetalle = () => {
  const { id } = useParams();
  const play = plays.find(p => p.id === id);

  if (!play) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-playfair text-4xl font-bold mb-4 text-foreground">
            Producción no encontrada
          </h1>
          <Link to="/producciones">
            <Button variant="outline" className="font-outfit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Producciones
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with Image */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-10" />
        <img
          src={play.image}
          alt={play.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            <Link to="/producciones">
              <Button 
                variant="ghost" 
                className="mb-6 text-foreground hover:text-primary font-outfit"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Producciones
              </Button>
            </Link>
            
            <Badge 
              className={`font-outfit uppercase font-bold text-sm px-4 py-2 mb-4 ${
                play.category === "musical" 
                  ? "bg-secondary text-secondary-foreground"
                  : play.category === "contemporaneo"
                  ? "bg-primary text-primary-foreground"
                  : "bg-theater-copper text-foreground"
              }`}
            >
              {play.category}
            </Badge>
            
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground mb-4">
              {play.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-foreground/90 font-outfit">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="text-lg">{play.author}</span>
              </div>
              {play.year && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-lg">{play.year}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Production Details */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-playfair text-4xl font-bold mb-6 text-foreground">
            Sobre la producción
          </h2>
          <p className="font-outfit text-lg text-muted-foreground leading-relaxed mb-8">
            {play.description}
          </p>

          {/* Performance Details if available */}
          {(play.date || play.time || play.venue) && (
            <div className="bg-card border border-border rounded-lg p-8 mb-12">
              <h3 className="font-playfair text-2xl font-bold mb-6 text-foreground">
                Detalles de la función
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {play.date && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-outfit font-semibold text-foreground mb-1">Fecha</p>
                      <p className="font-outfit text-sm text-muted-foreground">{play.date}</p>
                    </div>
                  </div>
                )}
                {play.time && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-outfit font-semibold text-foreground mb-1">Hora</p>
                      <p className="font-outfit text-sm text-muted-foreground">{play.time}</p>
                    </div>
                  </div>
                )}
                {play.venue && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-outfit font-semibold text-foreground mb-1">Lugar</p>
                      <p className="font-outfit text-sm text-muted-foreground">{play.venue}</p>
                    </div>
                  </div>
                )}
              </div>
              {play.status === "cartelera" && play.availability && (
                <div className="mt-8 pt-6 border-t border-border">
                  <Button size="lg" className="font-outfit w-full md:w-auto">
                    Reservar entradas
                  </Button>
                  <p className="font-outfit text-sm text-muted-foreground mt-3">
                    {play.availability === "disponible" && "Entradas disponibles"}
                    {play.availability === "pocas-entradas" && "Quedan pocas entradas"}
                    {play.availability === "agotado" && "Entradas agotadas"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Cast Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Elenco
            </h2>
            <p className="font-outfit text-lg text-muted-foreground max-w-2xl mx-auto">
              Los talentosos actores que dan vida a esta producción
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {actors.map((actor) => (
              <ActorCard
                key={actor.id}
                name={actor.name}
                role={actor.role}
                bio={actor.bio}
                image={actor.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="font-playfair text-4xl font-bold mb-6 text-foreground">
            ¿Interesado en esta producción?
          </h2>
          <p className="font-outfit text-lg text-muted-foreground mb-8">
            Contáctanos para más información sobre fechas, disponibilidad y reservas
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="font-outfit">
              Contactar
            </Button>
            <Link to="/producciones">
              <Button size="lg" variant="outline" className="font-outfit">
                Ver más producciones
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="font-outfit text-sm text-muted-foreground">
            © 2024 Compañía Hubert de Blanck. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProduccionDetalle;
