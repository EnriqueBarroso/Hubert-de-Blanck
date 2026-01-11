import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface ComingSoonProps {
  minHeight?: string; // Para ajustar altura si es página completa o sección
}

const ComingSoon = ({ minHeight = "min-h-[60vh]" }: ComingSoonProps) => {
  return (
    <div className={`w-full ${minHeight} flex items-center justify-center bg-background relative overflow-hidden py-20`}>
      
      {/* Luces sutiles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 text-center z-10">
        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>

        <h2 className="font-playfair text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight drop-shadow-sm animate-fade-in">
          Próximamente
        </h2>

        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6 opacity-70" />

        <p className="font-outfit text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in delay-100">
          El telón se está preparando para levantarse de nuevo.<br />
          Estamos ultimando los detalles de nuestra próxima temporada.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-200">
          <Link to="/producciones">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-outfit px-8 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              Ver Repertorio
            </Button>
          </Link>
          
          <Link to="/contacto">
            <Button 
              variant="ghost" 
              size="lg" 
              className="font-outfit text-muted-foreground hover:text-foreground group"
            >
              Contactar
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;