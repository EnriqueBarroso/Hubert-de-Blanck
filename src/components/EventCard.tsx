import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  image: string;
  category: string;
  categoryVariant?: "musical" | "contemporary" | "workshop";
}

const EventCard = ({ title, date, image, category, categoryVariant = "contemporary" }: EventCardProps) => {
  const variantColors = {
    musical: "bg-secondary text-secondary-foreground",
    contemporary: "bg-primary text-primary-foreground",
    workshop: "bg-theater-copper text-foreground",
  };

  return (
    <div className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10 group-hover:from-black/90 transition-all duration-300" />
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      
      <div className="absolute top-4 left-4 z-20">
        <Badge 
          className={`font-outfit uppercase font-bold text-xs px-3 py-1 ${variantColors[categoryVariant]}`}
        >
          {category}
        </Badge>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex items-center gap-2 text-sm text-foreground/70 mb-2 font-outfit">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <h3 className="font-playfair text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <Button 
          variant="outline" 
          className="opacity-0 group-hover:opacity-100 transition-opacity border-primary text-primary hover:bg-primary hover:text-primary-foreground font-outfit"
        >
          Ver detalles
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
