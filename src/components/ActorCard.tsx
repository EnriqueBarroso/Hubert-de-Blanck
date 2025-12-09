import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, AlignLeft, Calendar } from "lucide-react";

interface ActorCardProps {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  timePeriod?: string; // <--- Nueva propiedad opcional
}

const ActorCard = ({ name, role, bio, image, timePeriod }: ActorCardProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Usamos un div interactivo para evitar conflictos de botones */}
        <div 
          className="group relative overflow-hidden rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg h-full flex flex-col cursor-pointer"
          tabIndex={0}
          role="button"
        >
          {/* Imagen */}
          <div className="aspect-[3/4] overflow-hidden relative bg-muted z-0">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <User className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90 transition-opacity" />
            
            {/* Información VISIBLE EN LA TARJETA */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
              <h3 className="font-playfair text-xl font-bold mb-1 leading-tight">{name}</h3>
              <p className="font-outfit text-sm text-primary font-medium uppercase tracking-wide mb-2 line-clamp-1">
                {role}
              </p>
              
              {/* AQUÍ MOSTRAMOS EL PERIODO EN LUGAR DE LA BIO */}
              {timePeriod && (
                <div className="flex items-center gap-2 mb-3 text-white/80">
                  <Calendar className="h-3 w-3 text-secondary" />
                  <span className="font-outfit text-xs font-semibold tracking-wider">
                    {timePeriod}
                  </span>
                </div>
              )}
              
              {/* Botón visual decorativo */}
              <div className="flex items-center justify-center w-full rounded-md border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-xs font-medium text-white group-hover:bg-white group-hover:text-black transition-colors font-outfit mt-2">
                <AlignLeft className="mr-2 h-3 w-3" />
                Bio Completa
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>

      {/* CONTENIDO DEL MODAL (Aquí sí mostramos la Biografía) */}
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-background border-border">
        <div className="flex flex-col md:flex-row h-full max-h-[80vh]">
          {/* Columna Foto */}
          <div className="w-full md:w-1/3 bg-muted relative min-h-[300px]">
            {image ? (
              <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <User className="h-20 w-20 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Columna Texto */}
          <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col overflow-y-auto">
            <DialogHeader className="mb-4 text-left">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-primary uppercase tracking-widest font-outfit mb-1">{role}</p>
                  <DialogTitle className="font-playfair text-3xl md:text-4xl font-bold text-foreground">{name}</DialogTitle>
                </div>
                {timePeriod && (
                  <span className="text-xs font-outfit bg-secondary/10 text-secondary px-2 py-1 rounded border border-secondary/20 whitespace-nowrap">
                    {timePeriod}
                  </span>
                )}
              </div>
            </DialogHeader>
            
            <div className="prose prose-sm md:prose-base dark:prose-invert font-outfit text-muted-foreground leading-relaxed">
              <h4 className="font-bold text-foreground mb-2">Biografía</h4>
              {bio ? bio.split('\n').map((p, i) => <p key={i} className="mb-3">{p}</p>) : <p className="italic">Sin biografía disponible.</p>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActorCard;