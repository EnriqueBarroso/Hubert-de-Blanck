import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Actor } from "@/types";
import ActorCard from "@/components/ActorCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Clapperboard, Sparkles } from "lucide-react";

// Definimos el orden de las eras para que no salgan al azar
// Ajusta estos nombres EXACTAMENTE como los escribas en tu Base de Datos
const ERA_ORDER = ["Fundadores", "Maestros", "1990-2010", "2011-2020", "Elenco Actual"];

const EquipoArtistico = () => {
  const [team, setTeam] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const { data, error } = await supabase
        .from("actors")
        .select("*")
        .order("name");

      if (error) throw error;
      
      // Mapeo seguro para TypeScript
      const formattedTeam: Actor[] = (data || []).map((item: any) => ({
        ...item,
        // Si la columna está vacía en BD, asignamos valores por defecto
        role_type: item.role_type || 'actor',
        era: item.era || 'Elenco Actual' 
      }));

      setTeam(formattedTeam);
    } catch (error) {
      console.error("Error cargando equipo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para agrupar personas por su etapa (Era)
  const getPeopleByEra = (people: Actor[]) => {
    const grouped: Record<string, Actor[]> = {};
    
    people.forEach((person) => {
      const era = person.era || "Elenco Actual";
      if (!grouped[era]) grouped[era] = [];
      grouped[era].push(person);
    });

    return grouped;
  };

  // Componente interno para renderizar una lista agrupada
  const GroupedList = ({ filterRole }: { filterRole: string }) => {
    // 1. Filtramos por rol (Actor o Director)
    const filtered = team.filter(p => 
      filterRole === 'director' 
        ? (p.role_type === 'director' || p.role_type === 'ambos')
        : (p.role_type === 'actor' || p.role_type === 'ambos')
    );

    const grouped = getPeopleByEra(filtered);

    // 2. Ordenamos las eras según nuestra constante ERA_ORDER
    const sortedEras = Object.keys(grouped).sort((a, b) => {
      const indexA = ERA_ORDER.indexOf(a);
      const indexB = ERA_ORDER.indexOf(b);
      // Si no está en la lista, lo manda al final
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

    if (filtered.length === 0) {
      return (
        <div className="py-20 text-center border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground font-outfit">No hay registros en esta categoría aún.</p>
        </div>
      );
    }

    return (
      <div className="space-y-16 mt-8">
        {sortedEras.map((era) => (
          <div key={era} className="relative">
            {/* Título de la Etapa con diseño elegante */}
            <div className="flex items-center gap-4 mb-8">
               <h3 className="font-playfair text-3xl font-bold text-primary">
                 {era}
               </h3>
               <div className="h-px bg-border flex-1 opacity-50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {grouped[era].map((person) => (
                <ActorCard
                  key={person.id}
                  name={person.name}
                  role={person.role_type === 'ambos' ? 'Director & Actor' : (filterRole === 'director' ? 'Director' : 'Actor / Actriz')} 
                  bio={person.bio}
                  image={person.image || "/placeholder.svg"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 space-y-8">
        <Skeleton className="h-12 w-64 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-96 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        
        {/* Cabecera */}
        <div className="text-center mb-16">
          <span className="inline-block p-3 rounded-full bg-primary/10 text-primary mb-4">
             <Users className="w-6 h-6" />
          </span>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-4">
            Equipo Artístico
          </h1>
          <p className="font-outfit text-lg text-muted-foreground max-w-2xl mx-auto">
            El talento humano que ha construido nuestra historia, desde los fundadores hasta las nuevas generaciones.
          </p>
        </div>

        {/* Sistema de Pestañas */}
        <Tabs defaultValue="actores" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-14 bg-muted/50 p-1 rounded-full">
              <TabsTrigger 
                value="actores" 
                className="rounded-full font-outfit text-lg data-[state=active]:bg-background data-[state=active]:shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Elenco
              </TabsTrigger>
              <TabsTrigger 
                value="directores" 
                className="rounded-full font-outfit text-lg data-[state=active]:bg-background data-[state=active]:shadow-md transition-all"
              >
                <Clapperboard className="w-4 h-4 mr-2" />
                Dirección
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="actores" className="animate-fade-in">
             <GroupedList filterRole="actor" />
          </TabsContent>

          <TabsContent value="directores" className="animate-fade-in">
             <GroupedList filterRole="director" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EquipoArtistico;