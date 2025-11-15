import { ArrowUpRight } from "lucide-react";

interface BlogCardProps {
  title: string;
  image: string;
  excerpt?: string;
}

const BlogCard = ({ title, image, excerpt }: BlogCardProps) => {
  return (
    <article className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg aspect-video mb-4">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 group-hover:from-black/80 transition-all duration-300" />
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="h-5 w-5 text-secondary-foreground" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors mb-2 leading-tight">
        {title}
      </h3>
      {excerpt && (
        <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
      )}
    </article>
  );
};

export default BlogCard;
