import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActorCard from "@/components/ActorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, MapPin, Clock, ArrowLeft, Ticket } from "lucide-react";
import { Play } from "@/types";

// Interfaz local para combinar la info del actor con su personaje en esta obra
interface CastMember {
  id: string; // ID del actor
  name: string;
  role: string; // Aquí guardaremos el 'character_name'
  bio: string;
  image: string;
}

const ProduccionDetalle = () => {
  const { id } = useParams();
  const [play, setPlay] = useState<Play | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]); // Estado para el elenco específico
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPlayAndCast();
    }
  }, [id]);

  const fetchPlayAndCast = async () => {
    try {
      // 1. Cargar la Obra
      const { data: playData, error: playError } = await supabase
        .from("plays")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (playError) throw playError;
      setPlay(playData);

      // 2. Cargar el Elenco Específico (Join con play_actors)
      if (playData) {
        const { data: castData, error: castError } = await supabase
          .from("play_actors")
          .select(`
            character_name,
            actor:actors (
              id,
              name,
              bio,
              image
            )
          `)
          .eq("play_id", playData.id);

        if (castError) throw castError;

        // Transformamos los datos para que encajen con el ActorCard
        const formattedCast: CastMember[] = (castData || []).map((item: any) => ({
          id: item.actor.id,
          name: item.actor.name,
          role: item.character_name, // ¡Usamos el nombre del personaje aquí!
          bio: item.actor.bio,
          image: item.actor.image
        }));

        setCast(formattedCast);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        {/* Skeleton de carga */}
        <section className="relative h-[70vh] bg-muted animate-pulse" />
        <div className="container mx-auto px-4 py-12">
            <div className="space-y-4 max-w-2xl">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
      </div>
    );
  }

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
      
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/30 z-10" />
        <img
          src={play.image}
          alt={play.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            <Link to="/cartelera">
              <Button 
                variant="ghost" 
                className="mb-6 text-white hover:text-primary hover:bg-white/10 font-outfit"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            
            <Badge 
              className={`font-outfit uppercase font-bold text-sm px-4 py-2 mb-4 ${
                play.category.toLowerCase().includes("musical") 
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {play.category}
            </Badge>
            
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
              {play.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90 font-outfit">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">{play.author}</span>
              </div>
              {play.year && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
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
            Sinopsis
          </h2>
          <p className="font-outfit text-lg text-muted-foreground leading-relaxed mb-12">
            {play.description}
          </p>

          {/* Performance Details */}
          {(play.status === 'cartelera') && (
            <div className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-8 mb-16 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-playfair text-2xl font-bold text-foreground">
                  Próxima Función
                </h3>
                <Badge variant="outline" className="border-primary text-primary">
                    En Cartelera
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-outfit text-sm font-medium text-muted-foreground mb-1">Fecha</p>
                    <p className="font-playfair text-lg text-foreground font-semibold">
                        {play.date || "Por confirmar"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-outfit text-sm font-medium text-muted-foreground mb-1">Hora</p>
                    <p className="font-playfair text-lg text-foreground font-semibold">
                        {play.time || "20:00"} hrs
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-outfit text-sm font-medium text-muted-foreground mb-1">Lugar</p>
                    <p className="font-playfair text-lg text-foreground font-semibold">
                        {play.venue || "Sala Principal"}
                    </p>
                  </div>
                </div>
              </div>

              {play.availability === "disponible" && (
                  <div className="mt-8 pt-6 border-t border-border/50 flex justify-end">
                    <Button size="lg" className="font-outfit font-semibold px-8">
                        <Ticket className="mr-2 h-5 w-5" />
                        Reservar Entradas
                    </Button>
                  </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Cast Section Dinámica */}
      {cast.length > 0 && (
        <section className="py-20 px-4 bg-muted/30 border-t border-border/50">
            <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
                <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Reparto
                </h2>
                <p className="font-outfit text-lg text-muted-foreground max-w-2xl mx-auto">
                El talento detrás de los personajes
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {cast.map((actor) => (
                <div key={actor.id} className="relative group">
                    <ActorCard
                        name={actor.name}
                        role={actor.role} // Aquí se mostrará "Romeo", "Bernarda", etc.
                        bio={actor.bio}
                        image={actor.image}
                    />
                </div>
                ))}
            </div>
            </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4 mt-12">
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