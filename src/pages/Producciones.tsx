import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, User } from "lucide-react";
import { Play } from "@/types";

const Producciones = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: "all", label: "Todas" },
    { value: "teatro", label: "Teatro" },
    { value: "contemporaneo", label: "Contemporáneo" },
    { value: "musical", label: "Musical" }
  ];

  useEffect(() => {
    const fetchPlays = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("plays")
          .select("*")
          .eq("status", "repertorio") 
          .order("title", { ascending: true });

        if (error) throw error;
        setPlays(data || []);
      } catch (error) {
        console.error("Error fetching plays:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlays();
  }, []);
  
  const filteredPlays = selectedCategory === "all" 
    ? plays 
    : plays.filter(play => 
        play.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  return (
    <>
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Nuestro Repertorio
            </h1>
            <p className="font-outfit text-lg text-muted-foreground leading-relaxed">
              Un recorrido por las obras que han marcado nuestra historia.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 border-b border-border/50">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className="font-outfit"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[1, 2, 3].map((i) => (
                 <Skeleton key={i} className="aspect-[3/4] w-full rounded-lg" />
               ))}
            </div>
          ) : filteredPlays.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-outfit text-lg">
                No hay obras en repertorio con esta categoría.
              </p>
            </div>
          ) : (
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {filteredPlays.map((play) => (
                  <CarouselItem key={play.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="group relative overflow-hidden rounded-lg aspect-[3/4] cursor-pointer border border-border/50">
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 group-hover:from-black/90 transition-all duration-500" />
                      
                      <img
                        src={play.image || "/placeholder.svg"}
                        alt={play.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      <div className="absolute top-4 left-4 z-20">
                        <Badge className="font-outfit uppercase font-bold text-xs px-3 py-1 bg-secondary text-secondary-foreground">
                          {play.category}
                        </Badge>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                        <div className="flex flex-col gap-1 mb-3">
                          <div className="flex items-center gap-2 text-sm text-white/80 font-outfit">
                            <User className="h-4 w-4 text-primary" />
                            <span>{play.author}</span>
                          </div>
                          {play.year && (
                            <div className="flex items-center gap-2 text-sm text-white/80 font-outfit">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>{play.year}</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-playfair text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                          {play.title}
                        </h3>
                        
                        <p className="font-outfit text-sm text-gray-300 line-clamp-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {play.description}
                        </p>
                        
                        <Link to={`/producciones/${play.id}`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity border-primary text-primary hover:bg-primary hover:text-primary-foreground font-outfit w-full"
                          >
                            Ver ficha técnica
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          )}
        </div>
      </section>
    </>
  );
};

export default Producciones;