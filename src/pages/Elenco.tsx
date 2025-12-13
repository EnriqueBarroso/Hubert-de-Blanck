import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import ActorCard from "@/components/ActorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

// Use the database schema type directly
type Actor = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  created_at?: string | null;
  updated_at?: string | null;
};

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

  // Display actors in a simple grid without period grouping (since time_period doesn't exist)
  const sortedActors = [...actors].sort((a, b) => a.name.localeCompare(b.name));

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

      <section className="py-16 px-4 container mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Grid de Actores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedActors.map((actor) => (
                <ActorCard
                  key={actor.id}
                  name={actor.name}
                  role={actor.role}
                  bio={actor.bio}
                  image={actor.image}
                />
              ))}
            </div>

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