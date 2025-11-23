import { Button } from "@/components/ui/button";

interface ActorCardProps {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const ActorCard = ({ name, role, bio, image }: ActorCardProps) => {
  return (
    <article className="group relative overflow-hidden rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300">
      <div className="aspect-[3/4] overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-playfair text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="font-outfit text-sm text-secondary uppercase tracking-wider mb-2">
          {role}
        </p>
        <p className="font-outfit text-sm text-foreground/80 line-clamp-2 mb-3">
          {bio}
        </p>
        <Button 
          variant="outline" 
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Ver biografía
        </Button>
      </div>
    </article>
  );
};

export default ActorCard;
