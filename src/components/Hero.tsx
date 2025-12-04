import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
// Importamos la imagen de los telones
import heroTheater from "@/assets/hero-theater.jpg";

const Hero = () => {
  // Estado para controlar la animación de entrada
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Imagen de Fondo Fija */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        {/* Capa oscura para mejorar la lectura del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />
        
        <img
          src={heroTheater}
          alt="Telones del Teatro Hubert de Blanck"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido Fijo (Texto) */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-start container mx-auto px-4">
        <div className="max-w-4xl animate-fade-in">
          <p className="font-outfit text-sm font-medium text-secondary mb-4 tracking-widest uppercase flex items-center gap-2">
            <span className="w-8 h-px bg-secondary"></span>
            Teatro Cubano
          </p>
          
          <h1 className="font-playfair text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 leading-none shadow-black drop-shadow-2xl">
            Compañía <br/> Hubert de Blanck
          </h1>
          
          <div className="border-l-4 border-primary pl-6 mb-8">
            <p className="font-outfit text-2xl md:text-3xl text-white/90 leading-relaxed italic font-light drop-shadow-md">
              "El arte a favor del pensamiento"
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link to="/cartelera">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-outfit font-semibold rounded-full px-8 group shadow-lg shadow-primary/20"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Ver Cartelera
              </Button>
            </Link>
            <Link to="/compania">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black font-outfit font-semibold rounded-full px-8 transition-all"
              >
                Conócenos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Gradiente inferior para suavizar la transición con la siguiente sección */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
};

export default Hero;