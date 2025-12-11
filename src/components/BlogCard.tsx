import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  title: string;
  excerpt: string;
  image?: string;
  date?: string;
  category?: string;
}

const BlogCard = ({ title, excerpt, image, date, category }: BlogCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group cursor-pointer">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
        
        {category && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 hover:bg-primary text-white font-outfit uppercase text-xs tracking-wider">
              {category}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="p-6 pb-2">
        {date && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-outfit mb-3">
            <Calendar className="h-3 w-3 text-primary" />
            <span>{date}</span>
          </div>
        )}
        <h3 className="font-playfair text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="p-6 pt-2 flex-grow">
        <p className="font-outfit text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        
        {/* "Falso botón" visual para indicar que es clicable */}
        <span className="inline-block mt-4 text-sm font-bold text-primary border-b border-primary/0 group-hover:border-primary transition-all">
          Leer artículo completo &rarr;
        </span>
      </CardContent>
    </Card>
  );
};

export default BlogCard;