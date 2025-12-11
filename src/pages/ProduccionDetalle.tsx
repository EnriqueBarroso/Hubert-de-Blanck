import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActorCard from "@/components/ActorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, MapPin, Clock, ArrowLeft, Ticket, Megaphone } from "lucide-react";
import { Play } from "@/types";

interface CastMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const ProduccionDetalle = () => {
  const { id } = useParams();
  const [play, setPlay] = useState<Play | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPlayAndCast();
  }, [id]);

  const fetchPlayAndCast = async () => {
    try {
      setLoading(true);
      const { data: playData, error: playError } = await supabase
        .from("plays")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (playError) throw playError;
      setPlay(playData);

      if (playData) {
        const { data: castData, error: castError } = await supabase
          .from("play_actors")
          .select(`
            character_name,
            actor:actors (id, name, bio, image)
          `)
          .eq("play_id", playData.id);

        if (castError) throw castError;

        const formattedCast: CastMember[] = (castData || []).map((item: any) => ({
          id: item.actor.id,
          name: item.actor.name,
          role: item.character_name,
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
      <>
        <section className="relative h-[70vh] w-full bg-muted animate-pulse" />
        <div className="container mx-auto px-4 py-12 space-y-8">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-32 w-full" />
        </div>
      </>
    );
  }

  if (!play) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="font-playfair text-4xl font-bold mb-4 text-foreground">
          Producción no encontrada
        </h1>
        <Link to="/producciones">
          <Button variant="outline" className="font-outfit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Repertorio
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/30 z-10" />
        <img
          src={play.image || "/placeholder.svg"}
          alt={play.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            <div className="mb-6">
                <Link to={play.status === 'cartelera' ? "/cartelera" : "/producciones"}>
                <Button 
                    variant="ghost" 
                    className="text-white hover:text-primary hover:bg-white/10 font-outfit pl-0"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
                </Link>
            </div>
            
            <div className="flex gap-2 mb-4">
                <Badge 
                className={`font-outfit uppercase font-bold text-sm px-4 py-2 ${
                    play.status === 'cartelera' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
                >
                {play.status === 'cartelera' ? 'En Cartelera' : 'Repertorio'}
                </Badge>
                <Badge variant="outline" className="text-white border-white/50 font-outfit">
                    {play.category}
                </Badge>
            </div>
            
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              {play.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/90 font-outfit">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">{play.author}</span>
              </div>
              
              {play.director && (
                <div className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">Dir. {play.director}</span>
                </div>
              )}

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

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-playfair text-4xl font-bold mb-6 text-foreground">
            Sinopsis
          </h2>
          <p className="font-outfit text-lg text-muted-foreground leading-relaxed mb-12 whitespace-pre-wrap">
            {play.description}
          </p>

          {play.status === 'cartelera' && (
            <div className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-8 mb-16 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-playfair text-2xl font-bold text-foreground">
                  Próxima Función
                </h3>
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

              <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-end items-center gap-4">
                <p className="text-sm text-muted-foreground font-outfit italic">
                   * Entradas disponibles directamente en taquilla
                </p>
                <Button size="lg" className="font-outfit font-semibold px-8 opacity-70 cursor-not-allowed" disabled>
                    <Ticket className="mr-2 h-5 w-5" />
                    Venta en Taquilla
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

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
      )}
    </>
  );
};

export default ProduccionDetalle;