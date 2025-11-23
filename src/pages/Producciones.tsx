import { useState } from "react";
import Navbar from "@/components/Navbar";
import { plays } from "@/data/plays";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, User } from "lucide-react";

const Producciones = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const repertorioPlays = plays.filter(play => play.status === "repertorio");
  
  const filteredPlays = selectedCategory === "all" 
    ? repertorioPlays 
    : repertorioPlays.filter(play => play.category === selectedCategory);

  const categories = [
    { value: "all", label: "Todas" },
    { value: "teatro", label: "Teatro" },
    { value: "contemporaneo", label: "Contemporáneo" },
    { value: "musical", label: "Musical" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Nuestras Producciones
            </h1>
            <p className="font-outfit text-lg text-muted-foreground leading-relaxed">
              Explora nuestro repertorio completo de obras teatrales, desde los clásicos hasta 
              producciones contemporáneas que han marcado nuestra trayectoria artística.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
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

      {/* Carousel Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {filteredPlays.map((play) => (
                <CarouselItem key={play.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="group relative overflow-hidden rounded-lg aspect-[3/4] cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10 group-hover:from-black/95 transition-all duration-500" />
                    <img
                      src={play.image}
                      alt={play.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    <div className="absolute top-4 left-4 z-20">
                      <Badge 
                        className={`font-outfit uppercase font-bold text-xs px-3 py-1 ${
                          play.category === "musical" 
                            ? "bg-secondary text-secondary-foreground"
                            : play.category === "contemporaneo"
                            ? "bg-primary text-primary-foreground"
                            : "bg-theater-copper text-foreground"
                        }`}
                      >
                        {play.category}
                      </Badge>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <div className="flex items-center gap-2 text-sm text-foreground/70 mb-2 font-outfit">
                        <User className="h-4 w-4" />
                        <span>{play.author}</span>
                      </div>
                      {play.year && (
                        <div className="flex items-center gap-2 text-sm text-foreground/70 mb-3 font-outfit">
                          <Calendar className="h-4 w-4" />
                          <span>{play.year}</span>
                        </div>
                      )}
                      <h3 className="font-playfair text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {play.title}
                      </h3>
                      <p className="font-outfit text-sm text-foreground/80 line-clamp-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {play.description}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity border-primary text-primary hover:bg-primary hover:text-primary-foreground font-outfit"
                      >
                        Más información
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto text-center">
          <h2 className="font-playfair text-4xl font-bold mb-6 text-foreground">
            ¿Interesado en nuestras producciones?
          </h2>
          <p className="font-outfit text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contáctanos para conocer más sobre nuestro repertorio y disponibilidad
          </p>
          <Button size="lg" className="font-outfit">
            Contactar
          </Button>
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

export default Producciones;
