import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import ActorCard from "@/components/ActorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

// Definición de la interfaz del Actor
interface Actor {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  time_period: string | null;
}

const Elenco = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("actors")
        .select("*")
        .order("name"); // Orden alfabético dentro de cada grupo

      if (error) throw error;
      setActors(data || []);
    } catch (error) {
      console.error("Error cargando elenco:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de Agrupación por Periodo
  const groupedActors = actors.reduce((groups, actor) => {
    // Si no tiene periodo, lo ponemos en "Sin Clasificar" o "General"
    const period = actor.time_period || "General";
    
    if (!groups[period]) {
      groups[period] = [];
    }
    groups[period].push(actor);
    return groups;
  }, {} as Record<string, Actor[]>);

  // Ordenar los periodos para mostrarlos
  // "Actualidad" va primero, el resto se ordena como texto (descendente para años recientes primero)
  const sortedPeriods = Object.keys(groupedActors).sort((a, b) => {
    if (a === "Actualidad") return -1;
    if (b === "Actualidad") return 1;
    return b.localeCompare(a); 
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-12 bg-theater-darker text-center px-4">
        <h1 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-4">
          Nuestro Elenco
        </h1>
        <p className="font-outfit text-xl text-muted-foreground max-w-2xl mx-auto">
          Los rostros que dan vida a nuestras historias, desde los fundadores hasta la generación actual.
        </p>
      </section>

      {/* Listado por Grupos */}
      <section className="py-16 px-4 container mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {sortedPeriods.map((period) => (
              <div key={period} className="space-y-8 animate-fade-in">
                {/* Título del Periodo */}
                <div className="flex items-center gap-4">
                  <div className="h-px bg-border flex-grow"></div>
                  <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary px-6 py-2 border border-primary/20 rounded-full bg-primary/5 uppercase tracking-wider">
                    {period}
                  </h2>
                  <div className="h-px bg-border flex-grow"></div>
                </div>

                {/* Grid de Actores */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {groupedActors[period].map((actor) => (
                    <ActorCard
                      key={actor.id}
                      name={actor.name}
                      role={actor.role}
                      bio={actor.bio}
                      image={actor.image}
                      // Pasamos el periodo para que se muestre en la tarjeta
                      timePeriod={actor.time_period || undefined} 
                    />
                  ))}
                </div>
              </div>
            ))}

            {actors.length === 0 && (
              <div className="text-center py-20 border border-dashed border-border rounded-xl">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-playfair text-xl text-foreground mb-2">Sin registros</h3>
                <p className="text-muted-foreground">No hay actores registrados en el sistema actualmente.</p>
              </div>
            )}
          </div>
        )}
      </section>
      
      {/* Footer */}
      <footer className="bg-theater-darker py-8 border-t border-border mt-auto text-center">
        <p className="font-outfit text-sm text-muted-foreground">© 2024 Compañía Hubert de Blanck.</p>
      </footer>
    </div>
  );
};

export default Elenco;